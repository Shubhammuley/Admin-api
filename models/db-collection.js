const userModel = require("./user-schema");

const getUserByCredential = async ({ userNameOrEmail, password }) => {
  const data = await userModel.findOne({
    $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    password,
  });
  return data;
};


const addAdminUser = async ({ ...userDetails }) => {
  return await userModel.create(userDetails)
}
module.exports = Object.freeze({
  getUserByCredential,
  addAdminUser,
});
