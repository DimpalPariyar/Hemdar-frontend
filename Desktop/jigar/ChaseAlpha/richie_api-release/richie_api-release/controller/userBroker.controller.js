const UserBrokerModel = require('../model/userBroker.model');
const { validationResult } = require('express-validator');
const { generateLoginUrl } = require('../service/kite_connect');
const { default: mongoose } = require('mongoose');

const addBroker = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { _id: user } = res.locals.user;
  const { broker, clientId, apiKey, apiSecret } = req.body;

  try {
    const userBroker = await UserBrokerModel.create({
      user,
      broker,
      clientId,
      apiKey,
      apiSecret,
    });
    res.status(201).send(userBroker);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateBroker = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { _id: user } = res.locals.user;
  const { clientId, apiKey, apiSecret, active, accessToken } = req.body;
  const { id: brokerId } = req.params;

  const updateData = {
    clientId,
    apiKey,
    apiSecret,
    active,
    accessToken,
  };

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

    for (const key in updateData) {
      if (
        updateData[key] !== '' &&
        updateData[key] !== null &&
        updateData[key] !== undefined
      ) {
        broker[key] = updateData[key];
      }
    }

    await broker.save();
    res.status(200).send(broker);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getBroker = async (req, res, next) => {
  const { _id: user } = res.locals.user;
  try {
    const brokers = await UserBrokerModel.find({
      user,
    });
    res.status(200).send(brokers);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getSingleBroker = async (req, res, next) => {
  const { id: brokerId } = req.params;
  const { _id: userId } = res.locals.user;

  try {
    const broker = await UserBrokerModel.findOne({
      _id: brokerId,
      user: userId,
    });

    if (!broker) {
      return res.status(404).send({
        message: `no broker found with id: ${brokerId}`,
      });
    }
    res.status(200).send(broker);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteBroker = async (req, res, next) => {
  const { id: brokerId } = req.params;
  const { _id: userId } = res.locals.user;

  try {
    const broker = await UserBrokerModel.findOne({
      _id: brokerId,
      user: userId,
    });

    if (!broker) {
      return res.status(404).send({
        message: `no broker found with id: ${brokerId}`,
      });
    }
    await broker.remove();
    res.status(200).send({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getBrokerRequestToken = async (req, res, next) => {
  const { _id: user } = res.locals.user;

  const broker = await UserBrokerModel.findOne({
    user,
    active: true,
  });

  if (!broker) {
    return res.status(404).send({
      message: 'no active broker found',
    });
  }

  const loginUrl = generateLoginUrl({ apiKey: broker.apiKey });

  res.status(200).send({ loginUrl });
};

module.exports = {
  addBroker,
  updateBroker,
  getBroker,
  getSingleBroker,
  deleteBroker,
  getBrokerRequestToken,
};
