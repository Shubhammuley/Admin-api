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

module.exports = Object.freeze({
  getUserByCredential,
  addAdminUser,
  findOneWorkload,
  updateWorkload,
  findOneTableLog,
  updateTableLog,
});
