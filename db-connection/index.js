const mongoose = require("mongoose");
const uri = "mongodb+srv://shubham:muley123@cluster0.y0koj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = mongoose
  .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("Connected to Mongo Database"))
  .catch((err) => console.log(err));
