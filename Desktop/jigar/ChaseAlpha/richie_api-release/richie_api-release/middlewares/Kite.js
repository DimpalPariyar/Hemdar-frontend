const { default: mongoose } = require('mongoose');
const UserBrokerModel = require('../model/userBroker.model');
const { generateAccessToken } = require('../service/kite_connect');

const createKiteAccessToken = async (req, res, next) => {
  const { _id: user } = res.locals.user;
  const { requestToken } = req.body;
  const { id: brokerId } = req.params;

  if (!requestToken) {
    return next();
  }

  try {
    const broker = await UserBrokerModel.findOne({
      _id: mongoose.Types.ObjectId(brokerId),
      user: user,
    });

    if (!broker) {
      return res.status(404).send({
        message: `no broker found with id: ${brokerId}`,
      });
    }

    const sessionData = {
      apiKey: broker.apiKey,
      apiSecret: broker.apiSecret,
      requestToken,
    };

    const accessToken = await generateAccessToken(sessionData);
    req.body.accessToken = accessToken;

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { createKiteAccessToken };
