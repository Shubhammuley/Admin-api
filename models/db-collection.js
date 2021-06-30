const userModel = require('./user-schema');
const workloadModel = require('./workload-schema');
const logTableModel = require('./log-table-schema');

// user collection
const getUserByCredential = async ({ userNameOrEmail, password }) => {
  const data = await userModel.findOne({
    $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    password,
  });
  return data;
};

const addAdminUser = async ({ ...userDetails }) => {
  return await userModel.create(userDetails);
};

// workload collection
const findOneWorkload = async () => {
  return await workloadModel.findOne({
    status: 'pending',
  });
};

const updateWorkload = async ({ filterObj, infoToUpdate }) => {
  return await workloadModel.findOneAndUpdate(filterObj, infoToUpdate);
}

// log-table-schema
const findOneTableLog = async ({ filterObj }) => {
  return await logTableModel.findOne(filterObj);
};

const updateTableLog = async ({ filterObj, infoToUpdate }) => {
  return await logTableModel.findOneAndUpdate(filterObj, infoToUpdate);
};

const listTableLog = async ({
  pageNo,
  pageSize,
  pageOffset,
}) => {
  const [result] = await logTableModel.aggregate([
    {
      $match: {
        status: { $ne: "pending" },
      },
    }, {
      $project: {
        id: '$_id',
        _id: 0,
        fileName: 1,
        startTime: 1,
        endTime: 1,
        duration: 1,
        status: 1,
        errorSku: 1,
        successSku: 1,
        totalNumberOfRecord: 1,
      }
    },
    {
      $facet: {
        metaData: [{ $count: 'total' }, { $addFields: { page: pageNo } }],
        data: [{ $skip: pageOffset }, { $limit: pageSize }],
      },
    }]);
  return result;
};

module.exports = Object.freeze({
  getUserByCredential,
  addAdminUser,
  findOneWorkload,
  updateWorkload,
  findOneTableLog,
  updateTableLog,
  listTableLog,
});
