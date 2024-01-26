const SubscriptionModel = require('../model/subscription.model');
const OrderModel = require('../model/order.model');
const UserModel = require('../model/user.model');
const CartModel = require('../model/cart.model');
const { PriceModel } = require('../model/price.model');
const ProductModel = require('../model/product.model');
// const logger = require('../utils/logger');
const _ = require('lodash');
const { validationResult } = require('express-validator');

const moment = require('moment');
const productviseUserModel = require('../model/productviseUser.model');

const startSubscription = async (orderId) => {
  const order = await OrderModel.findById(orderId);
  if (!order.subscriptionId) {
    return;
  }
  const subscription = await SubscriptionModel.findById(
    order.subscriptionId
  ).populate(['planId']);
  subscription.renewCount = subscription.endTime
    ? subscription.renewCount + 1
    : 0;
    subscription.startTime = moment(new Date());
    subscription.endTime = moment(new Date())
      .add(subscription.planId.validityPeriodInDays, 'days')
      .endOf('day');
    subscription.active = true;
  await subscription.save();
};

const subscriptionCheck = async (req, res, next) => {
  try {
    const subscriptionList = await SubscriptionModel.find({
      active: true,
    });
    for (const subscription of subscriptionList) {
      const { advisoryId, userId, endTime } = subscription;
      const expirationDate = moment(endTime);
      const currentDate = moment(new Date());

      const notify = expirationDate.diff(currentDate, 'day') === 0;
      const expire = expirationDate.diff() < 0;

      if (expire) {
        subscription.active = false;
        await subscription.save();
        await UserModel.updateOne(
          {
            _id: userId,
          },
          {
            $pull: {
              subscribedAdvisories: advisoryId,
              activeSubscriptions: subscription._id,
            },
          }
        );
        await productviseUserModel.updateOne({
          productId:advisoryId
        },{
           $pull:{
            listofuserId:{
              id:userId
            }
           }
        })
      }
    }
    res.status(200).send({});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const assignSubscription = async (req, res, next) => {
  try {
    const subscriptionArr = req.body;
    for (const details of subscriptionArr) {
      const product = await ProductModel.findOne({
        productTitle: details.Product,
      }).lean();

      const user = await UserModel.findOne({
        mobile: details.Mobile,
      }).lean();

      const price = product.subscriptionPlanIds.find((plan) => {
        return plan.validityPeriodInDays === details.Duration;
      });

      const newSub = await SubscriptionModel.create({
        advisoryId: product._id,
        userId: user._id,
        planId: price._id,
        startTime: moment(new Date()),
        endTime: moment(new Date())
          .add(price.validityPeriodInDays, 'days')
          .endOf('day'),
        active: true,
      });
      await UserModel.updateOne(
        { _id: user._id },
        {
          $push: {
            subscribedAdvisories: product._id,
            activeSubscriptions: newSub._id,
          },
        }
      );
    }
    // logger.log('info', 'created subs', {
    //   tags: 'create sub',
    // });
    res.status(200).send({
      message: 'Subscription added',
    });
  } catch (error) {
    // logger.log('error', 'create subscription error', {
    //   tags: 'create sub',
    //   additionalInfo: {
    //     errorMessage: error.message,
    //     error,
    //   },
    // });
    console.log(error);
    next(error);
  }
};

const createCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  const {
    id,
    userId,
    planId,
    isESignMandatory,
    actualPrice,
    discountPercentage,
    validityPeriodInDays,
  } = req.body;

  const product = await ProductModel.findOne({ _id: id }).lean();
  const selectedPlan = _.find(
    product.subscriptionPlanIds,
    (plan) => plan._id.toString() === planId
  );
  if (!selectedPlan && (!actualPrice || !validityPeriodInDays)) {
    return next({
      status: 400,
      message: 'Please provide custom plan details',
    });
  }

  let plan;

  if (!selectedPlan) {
    let discountedPrice = actualPrice;

    if (discountPercentage) {
      discountedPrice = actualPrice - (discountPercentage / 100) * actualPrice;
    }

    const customPlanDetails = {
      actualPrice,
      discountPercentage: discountPercentage || 0,
      discountedPrice,
      validityPeriodInDays,
    };

    plan =
      (await PriceModel.findOne(customPlanDetails)) ||
      (await PriceModel.create(customPlanDetails));
  } else {
    plan = selectedPlan;
  }

  const gst9percent = ((plan.discountedPrice ?? plan.actualPrice) * 9) / 100;
  const billTotal =
    (plan.discountedPrice ?? plan.actualPrice) + gst9percent * 2;

  const cart =
    (await CartModel.findOne({
      userId,
      subscriptionPlanId: plan._id,
      advisoryId: product._id,
    })) ||
    (await CartModel.create({
      userId,
      amount: billTotal,
      subscriptionPlanId: plan._id,
      advisoryId: product._id,
      isESignRequire: isESignMandatory,
    }));

  res.status(200).send(cart);
};

module.exports = {
  startSubscription,
  subscriptionCheck,
  assignSubscription,
  createCart,
};
