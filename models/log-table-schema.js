const mongoose = require("mongoose");

const errorSkuSchema = new mongoose.Schema({
  skuId: { type: String, trim: true },
  errorDetail: { type: String, trim: true },
  tag: { type: String, trim: true },
});
const logTable = new mongoose.Schema({
    fileName: { type: String, trim: true, required: true },
    recordEntered: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'failure', 'aborted', 'success', 'error'], required: true },
    errorSku: [errorSkuSchema],
    successSku: [{ type: String, trim: true}],
    startTime: { type: Date, default: null, required: true },
    endTime: { type: Date, default: null, required: true },
    duration: { type: Number, default: null },
}, { collection: 'logTable' })

module.exports = mongoose.model('LogTable', logTable)