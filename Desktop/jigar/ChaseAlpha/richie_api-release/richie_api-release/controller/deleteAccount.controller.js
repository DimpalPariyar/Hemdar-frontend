const DeleteAccountModel = require('../model/deleteAccount.model');
const UserModel = require('../model/user.model');

const deleteAccountRequest = async (req, res, next) => {
  const { _id: userId } = res.locals.user;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return next({
        message: 'No user found',
        status: 404,
      });
    }
    if (user.deleted) {
      return next({
        message: 'Delete request already sent',
        status: 409,
      });
    }
    user.deleted = true;
    await user.save();
    await DeleteAccountModel.create({ userId });
    await res.status(200).send({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { deleteAccountRequest };
