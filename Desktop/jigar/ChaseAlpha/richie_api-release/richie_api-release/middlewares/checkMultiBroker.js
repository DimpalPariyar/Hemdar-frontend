const UserBrokerModel = require('../model/userBroker.model');

const checkMultiBroker = async (req, res, next) => {
  const { _id: user, multiBroker } = res.locals.user;
  try {
    const brokerExists = await UserBrokerModel.findOne({
      user,
    });

    if (!brokerExists) {
      return next();
    }
    if (!multiBroker) {
      return res.status(400).json({
        success: false,
        message: "User don't have multi broker enabled",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const checkDuplicateBroker = async (req, res, next) => {
  const { _id: user } = res.locals.user;
  const { broker, clientId, apiKey, apiSecret } = req.body;
  try {
    const duplicateBroker = await UserBrokerModel.findOne({
      user,
      broker,
      clientId,
      apiKey,
      apiSecret,
    });
    if (duplicateBroker) {
      return res.status(409).json({
        success: false,
        message: 'Broker already added',
      });
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  checkMultiBroker,
  checkDuplicateBroker,
};
