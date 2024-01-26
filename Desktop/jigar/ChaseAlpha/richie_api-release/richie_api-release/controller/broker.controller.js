const BrokerModel = require('../model/broker.model');
const { validationResult } = require('express-validator');

const getBrokers = async (req, res, next) => {
  try {
    const brokers = await BrokerModel.find({});
    res.status(200).send(brokers);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addBroker = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const { name } = req.body;
  try {
    const brokerExists = await BrokerModel.findOne({
      name,
    });
    if (brokerExists) {
      return res.status(409).send({
        message: 'broker already added',
      });
    }
    await BrokerModel.create({ name });
    res.status(201).send({message:'Broker Created Successfully'});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateBroker = async (req, res, next) => {
  const {
    body: { name },
    params: { id: brokerId },
  } = req;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  try {
    const broker = await BrokerModel.findOne({
      _id: brokerId,
    });
    if (!broker) {
      return res.status(404).send({
        message: `no broker found with id: ${brokerId}`,
      });
    }
    if (name) {
      broker.name = name;
    }
    await broker.save();
    res.status(200).send({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteBroker = async (req, res, next) => {
  const { id: brokerId } = req.params;

  try {
    const broker = await BrokerModel.findOne({
      _id: brokerId,
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

module.exports = { getBrokers, addBroker, updateBroker, deleteBroker };
