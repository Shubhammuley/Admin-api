const mongoose = require("mongoose");
const uri = "mongodb+srv://shubham:muley123@cluster0.y0koj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = mongoose
  .connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Connected.."))
  .catch((err) => console.log(err));
