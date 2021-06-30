const multer = require("multer");
const csv = require("fast-csv");
const { Readable } = require("stream");
const {
  insertWorkload,
  insertTableLog,
  checkPendingWorkload,
  getWorkloadDetails,
  abortUpdate,
  updateTableLog,
} = require("../models/db-collection");
const express = require("express");
const router = express.Router();

// Multer Upload Storage
var storage = multer.memoryStorage();

// Filter for CSV file
const csvFilter = (req, file, cb) => {
  if (!file.mimetype.includes("csv")) {
    req.fileValidationError = "Only csv files are allowed!";
    return cb(new Error("Only csv files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: csvFilter }).single(
  "file"
);

router.post("/v1/upload-csv-file", (req, res) => {
  upload(req, res, async (err) => {
    if (req.fileValidationError) {
      return res.status(400).send({
        message: req.fileValidationError,
      });
    } else if (!req.file) {
      return res.status(400).send({
        message: "Please upload a CSV file!",
      });
    } else if (err instanceof multer.MulterError) {
      return res.status(400).send({
        message: err,
      });
    } else if (err) {
      return res.status(400).send({
        message: err,
      });
    }
    try {
      const getPendingWorkload = await checkPendingWorkload();
      if (getPendingWorkload.length) {
        return res.status(400).send({
          message: "Update process is in progress, try again later",
        });
      }
      // Import CSV file to db
      let csvData = [];
      const stream = Readable.from(req.file.buffer);
      stream
        .pipe(
          csv.parse({
            headers: ["sku", "productName", "shippingGroups"],
            renameHeaders: true,
          })
        )
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          csvData.push({
            fileName: req.file.originalname,
            sku: row["sku"],
            productName: row["productName"],
            shippingGroup: row["shippingGroups"],
            status: "pending",
            importedBy: req.body.userId,
            importedAt: Date.now(),
          });
        })
        .on("end", async () => {
          await insertTableLog({
            fileName: req.file.originalname,
            totalNumberOfRecord: csvData.length,
            status: "pending",
          })
            .then((logDetails) => {
              csvData.forEach((item) => {
                item.numberOfRecord = csvData.length;
                item.logId = logDetails._id;
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: "Fail to insert logs into database!",
                error: err.message,
              });
            });
          await insertWorkload(csvData)
            .then(() => {
              res.status(200).send({
                message: "CSV file imported successfully",
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: "Fail to import data into database!",
                error: err.message,
              });
            });
        });
    } catch (error) {
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }
  });
});

router.get("/v1/get/details", async (req, res) => {
  try {
    const [data] = await getWorkloadDetails();
    res.status(200).send({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      data: err,
    });
  }
});

router.post("/v1/abort", async (req, res) => {
  try {
    const pendingWorkload = await checkPendingWorkload();
    const errorSku = pendingWorkload.map((item) => {
      return {
        skuId: item.sku,
        errorDetail: "Aborted",
        tag: "",
      };
    });
    await abortUpdate({
      filterObj: {
        $or: [{ status: "pending" }, { status: "inProgress" }],
      },
      infoToUpdate: {
        status: "aborted",
      },
    });
    if (pendingWorkload.length) {
      await updateTableLog({
        filterObj: {
          _id: pendingWorkload[0].logId,
        },
        infoToUpdate: {
          errorSku,
          status: "aborted",
        },
      });
    }
    res.status(200).send({
      status: "success",
    });
  } catch (err) {
    res.status(500).send({
      status: "error",
      data: err,
    });
  }
});

module.exports = router;
