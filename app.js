const express = require('express')
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./db-connection');
const { getUserByCredential, listTableLog, deleteLogDetail } = require('./models/db-collection');
const { processingCron } = require('./use-case/processing-cron');
const workload = require('./routes/workload');
const port = process.env.NODE_PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors());
app.use('/api/workload', workload);

app.post('/api/v1/login', async (req, res) => {
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

app.get('/api/v1/get', async (req, res) => {
  try {
    const data = await processingCron(req.query);
    res.send({
      status: 'success',
      data,
    });
  } catch (e) {
    console.log('sss', e);
    res.send({
      status: 'error'
    });
  }
});

app.get('/api/v1/list/import-history', async (req, res) => {
  try {
    const requestQuery = req.query;
    const pageNo = parseInt(requestQuery.pageNo, 10) || 1;
    const pageSize = parseInt(requestQuery.pageSize, 10) || 10;
    const startDate = requestQuery.startDate;
    const endDate = requestQuery.endDate;
    const pageOffset = (pageNo - 1) * pageSize;
    const data = await listTableLog({
      pageNo,
      pageSize,
      pageOffset,
      startDate,
      endDate,
    });
    res.send({
      status: 'success',
      data,
    });
  } catch (e) {
    console.log('----------error', e);
    res.send({
      status: 'error',
      data: e,
    });
  }
});

app.delete('/api/v1/delete/import-history/:logId', async (req, res) => {
  try {
    const { logId } = req.params;
    await deleteLogDetail({ _id: logId });
    res.send({
      status: 'success',
    });
  } catch (e) {
    console.log('sss', e);
    res.send({
      status: 'error'
    });
  }
});
app.listen(port, () => console.log(`Express server listening on port ${port}`))