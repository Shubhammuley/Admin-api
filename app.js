const express = require('express')
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./db-connection')
const { getUserByCredential } = require('./models/db-collection')
const port = process.env.NODE_PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());

app.post('/api/v1/login',async(req,res)=>{
  try {
    console.log(req.body)
    const data = await getUserByCredential(req.body);
    res.send({
      status: 'success',
      data,
    });
  } catch {
    res.send({
      status: 'error'
    });
  }
});

app.listen(port,()=>console.log(`Express server listening on port ${port}`))