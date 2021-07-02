const {
  findOneWorkload,
  updateWorkload,
  findOneTableLog,
  updateTableLog,
} = require("../models/db-collection");
const {
  getProductByProductId,
  getAllProductVariantByProductId,
  getMetaFieldsByProductIdAndVariantId,
  updateMetaField,
  createMetaField,
} = require("../third-party-call/big-commerce");

async function runFunction(record) {
  // const record = await findOneWorkload();
  const { sku } = record || {};
  if (sku) {
    const log = await findOneTableLog({
      filterObj: { _id: String(record.logId) },
    });
    const start = new Date();
    try {
      await updateWorkload({
        filterObj: { _id: String(record._id) },
        infoToUpdate: { status: "inProgress" },
      });
      const { status, data } = await getProductByProductId({ sku });
      if (status !== 200 && !data) {
        throw { errorCode: 404, errorMessage: "Product not found" };
      }
      const [product] = data;
      let productVariants = await getAllProductVariantByProductId({
        productId: product.product_id,
        page: 1,
      });
      if (productVariants.status !== 200) {
        throw { errorCode: 404, errorMessage: "Product variant not found" };
      }
      let productsData = productVariants.data.data;
      let variant = productsData.find((item) => item.sku === sku);
      while(!variant) {
        if(!variant && productVariants.data.meta.pagination.total_pages > productVariants.data.meta.pagination.current_page) {
          productVariants = await getAllProductVariantByProductId({
            productId: product.product_id,
            page: productVariants.data.meta.pagination.current_page + 1,
          });
          if (productVariants.status !== 200) {
            throw { errorCode: 404, errorMessage: "Product variant not found" };
          }
          productsData = productVariants.data.data;
          variant = productsData.find((item) => item.sku === sku);
        } else {
          break ;
        }
      };
      const variantId = variant.id;
      const metaFields = await getMetaFieldsByProductIdAndVariantId({
        productId: product.product_id,
        variantId,
      });
      const metaFieldsData = (metaFields.data && metaFields.data.data) || []; 
      // create or update meta field
      const fieldToUpdate = metaFieldsData.find((item) => item.key === 'shipping-groups');
      if (fieldToUpdate) {
        await updateMetaField({
          productId: product.product_id,
          variantId,
          metafieldId: fieldToUpdate.id,
          value: `[\"${record.shippingGroup}\"]`
        })
      } else {
        await createMetaField({
          productId: product.product_id,
          variantId,
          value: `[\"${record.shippingGroup}\"]`,
          key: 'shipping-groups',
          permission_set: 'write',
          namespace: "shipping.shipperhq",
          // resource_type: "variant", // Need to confirm
          resource_id: variantId,
        })
      }

      await updateWorkload({
        filterObj: { _id: String(record._id) },
        infoToUpdate: { status: "success" },
      });
      const { totalNumberOfRecord, recordEntered, errorSku, startTime } = log;
      const infoToUpdate = {
        $push: { successSku: sku },
        recordEntered: recordEntered + 1,
      };
      infoToUpdate.endTime = new Date();
      if (!startTime) {
        infoToUpdate.startTime = start;
        infoToUpdate.averageDuration = infoToUpdate.endTime - start;
      }
      if (totalNumberOfRecord - recordEntered === 1) {
        if (errorSku.length) {
          infoToUpdate.status = "error";
        } else {
          infoToUpdate.status = "success";
        }
        const begin = startTime || start;
        infoToUpdate.duration = infoToUpdate.endTime - begin;
      }
      if (recordEntered < 6) {
        infoToUpdate.averageDuration = infoToUpdate.endTime - start;
      }
      await updateTableLog({
        filterObj: { _id: String(record.logId) },
        infoToUpdate,
      });
      return true;
    } catch (e) {
      console.log('----e', e);
      await updateWorkload({
        filterObj: { _id: String(record._id) },
        infoToUpdate: { status: "error" },
      });
      const { totalNumberOfRecord, recordEntered, successSku, startTime } = log;
      const infoToUpdate = {
        $push: {
          errorSku: {
            skuId: sku,
            errorDetail: JSON.stringify(e),
          },
        },
        recordEntered: recordEntered + 1,
      };
      infoToUpdate.endTime = new Date();
      if (!startTime) {
        infoToUpdate.startTime = start;
        infoToUpdate.averageDuration = infoToUpdate.endTime - start;
      }
      if (totalNumberOfRecord - recordEntered === 1) {
        if (successSku.length) {
          infoToUpdate.status = "error";
        } else {
          infoToUpdate.status = "failure";
        }
        const begin = startTime || start;
        infoToUpdate.duration = infoToUpdate.endTime - begin;
      }
      if (recordEntered < 6) {
        infoToUpdate.averageDuration = infoToUpdate.endTime - start;
      }
      await updateTableLog({
        filterObj: { _id: String(record.logId) },
        infoToUpdate,
      });
      // throw e;
      return true;
    }
  }
  return false
}

async function processingCron () {
  let record = await findOneWorkload();
  while(record) {
    await runFunction(record);
    record = await findOneWorkload();
  }
  // for (let i = 0; i < 8; i++) {
  //   const check = await runFunction();
  //   if(!check) {
  //     break;
  //   }
  // }
};

module.exports = Object.freeze({
  processingCron,
});
