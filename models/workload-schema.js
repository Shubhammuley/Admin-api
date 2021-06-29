const mongoose = require("mongoose");

const workLoad = new mongoose.Schema({
    fileName: { type: String, trim: true, required: true },
    sku: { type: String, trim: true, required: true },
    productName: { type: String, required: true },
    shippingGroup: { type: String, required: true },
    numberOfRecord: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'inProgress', 'aborted', 'success', 'error'], required: true },
    logId: { type: mongoose.Schema.Types.ObjectId, require: true },
    importedBy: { type: mongoose.Schema.Types.ObjectId, require: true },
    importedAt: { type: Date, default: Date.now(), required: true },
}, { collection: 'workLoad' })

module.exports = mongoose.model('Workload', workLoad)