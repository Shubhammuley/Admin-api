const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name:{type: String, trim: true, required: true },
  email:{ type: String, trim: true, required: true },
  userName:{type: String, trim: true, required: true },
  password: { type: String, trim: true, required: true },
}, { collection: 'adminUser' })

module.exports = mongoose.model('AdminUser',schema)