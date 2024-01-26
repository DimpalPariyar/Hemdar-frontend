const Razorpay = require('razorpay');
const {
  validateWebhookSignature,
} = require('razorpay/dist/utils/razorpay-utils');
const { PriceModel } = require('../model/price.model');
require('dotenv').config();
// const logger = require('../utils/logger');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const verifyWebhookSignature = (webhookBody, webhookSignature) => {
  const key_secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  // const isTest = process.env.NODE_ENV !== 'production';
  // if (isTest) return true;
  return validateWebhookSignature(
    JSON.stringify(webhookBody),
    webhookSignature,
    key_secret
  );
};

function getPeriodInterval(numberOfDays) {
  let period;
  let frequency;
  if (numberOfDays < 7) {
    frequency = 7;
    period = 'daily';
  } else if (numberOfDays < 30) {
    period = 'weekly';
    frequency = numberOfDays / 7;
  } else if (numberOfDays < 365) {
    period = 'monthly';
    frequency = numberOfDays / 30;
  } else {
    period = 'yearly';
    frequency = numberOfDays / 365;
  }
  frequency = Math.round(frequency);
  return {
    period,
    frequency,
  };
}

const createRazorPayPlans = () => {
  return async (req, res, next) => {
    try {
      const { productTitle, subscriptionPlanIds } = res.locals.body || req.body;
      if (subscriptionPlanIds && subscriptionPlanIds.length > 0) {
        const priceModels = await PriceModel.find()
          .where(`_id`)
          .in(subscriptionPlanIds)
          .exec();
        for (const priceModel of priceModels) {
          await createPlan(productTitle, priceModel);
        }
      }
      next();
    } catch (error) {
      // logger.log('error', 'razor pay plan creation error', {
      //   tags: 'razorpay',
      //   additionalInfo: { errorMessage: error.message, error },
      // });
      console.log(error);
      return res.status(422).json({
        success: false,
        message: error.message,
      });
    }
  };
};
const createPlan = async (productTitle, planDetails) => {
  const { period, frequency } = getPeriodInterval(
    planDetails.validityPeriodInDays
  );
  const amount = Math.round(planDetails.discountedPrice * 100);
  const finalAmount = Math.round(amount + (amount * 18) / 100);
  const options = {
    period,
    interval: frequency,
    item: {
      name: productTitle + '-' + planDetails.priceName,
      amount: finalAmount,
      currency: 'INR',
      description: productTitle + '-' + planDetails.priceName,
    },
    notes: {
      advisory_title: productTitle,
      price_id: planDetails._id.toString(),
    },
  };
  const { id } = await instance.plans.create(options);
  await PriceModel.findByIdAndUpdate(planDetails._id.toString(), {
    razorPayPlanId: id,
  });
  return id;
};

const getAllSubscriptionInvoices = async (subscriptionId) =>
  instance.invoices.all({
    subscription_id: subscriptionId,
  });

const syncSubscription = async (subscriptionId) =>
  instance.subscriptions.fetch(subscriptionId);
const fetchOrder = async (orderId) => instance.orders.fetch(orderId);
const fetchOrderPayments = async (orderId) =>
  instance.orders.fetchPayments(orderId);
const cancelSubscription = async (subscriptionId, cancelAtCycleEnd = false) =>
  instance.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);

const createSubscription = async (
  userId,
  productTitle,
  razorPayPlanId,
  priceModel
) => {
  const options = {
    plan_id: razorPayPlanId,
    customer_notify: 1,
    quantity: 1,
    total_count: 10,
    addons: [],
    notes: {
      advisory_title: productTitle,
      price_id: priceModel._id,
      userId: userId,
    },
  };

  return instance.subscriptions.create(options);
};
const createRazorPayOrder = async (orderDetails) => {
  const options = {
    amount: Math.round(orderDetails.amount + (orderDetails.amount * 18) / 100), // amount in the smallest currency unit
    currency: 'INR',
    receipt: orderDetails.id,
    notes: {
      userId: orderDetails.userId.toString(),
      type: orderDetails.type,
      productIds: orderDetails.productIds.toString(),
    },
  };

  return instance.orders.create(options);
};

module.exports = {
  createRazorPayOrder,
  createRazorPayPlans,
  createPlan,
  createSubscription,
  syncSubscription,
  cancelSubscription,
  getAllSubscriptionInvoices,
  fetchOrderPayments,
  fetchOrder,
  verifyWebhookSignature,
};
