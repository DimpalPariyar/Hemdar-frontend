const SuperCourseModel = require('../model/superCourse.model');
const {
  createRazorPayOrder,
  createPlan,
  createSubscription,
} = require('../service/razorpay_service');
const courseType = require('../constants/courseType');
const OrderModel = require('../model/order.model');
const BillingModel = require('../model/billing.model');
const SubscriptionOrderModel = require('../model/subscriptionOrder.model');
const SubscriptionModel = require('../model/subscription.model');
const { validationResult } = require('express-validator');
const CartModel = require('../model/cart.model');
const { getDocumentStatus } = require('../service/digio_service');
const mongoose = require('mongoose');
// const logger = require('../utils/logger');

function createOrder(
  userId,
  billingId,
  amount,
  superCourseId,
  razorPayResponse,
  next,
  res
) {
  //create an order
  const createOrder = new OrderModel({
    programId: null,
    programSessions: [],
    userId: userId,
    totalAmount: amount,
    billingId: billingId,
    superCourseId: [superCourseId],
    razorPayOrderId: razorPayResponse.id,
    amount: razorPayResponse.amount,
    amount_paid: razorPayResponse.amount_paid,
    amount_due: razorPayResponse.amount_due,
    currency: razorPayResponse.currency,
    notes: razorPayResponse.notes,
    receipt: razorPayResponse.receipt,
    status: razorPayResponse.status,
    attempts: razorPayResponse.attempts,
    created_at: razorPayResponse.created_at
      ? new Date(razorPayResponse.created_at * 1000)
      : null,
  });

  createOrder.save(function (err) {
    if (err) {
      return next(err);
    }
    return res.status(200).json({
      success: true,
      message: 'Order is created sucessfully',
      amountToBePaid: createOrder.totalAmount,
      orderId: createOrder._id,
      razorPayOrderId: createOrder.razorPayOrderId,
    });
  });
}

function createSubscriptionOrder(
  userId,
  billingId,
  advisoryId,
  razorPayResponse,
  gstNo,
  next,
  res
) {
  //create an order
  const createOrder = new SubscriptionOrderModel({
    razorPaySubscriptionId: razorPayResponse.id,
    advisoryId: advisoryId,
    userId: userId,
    billingId: billingId,
    gst: gstNo,
    planId: razorPayResponse.plan_id,
    customerId: razorPayResponse.customer_id,
    status: razorPayResponse.status,
    currentStart: razorPayResponse.current_start
      ? new Date(razorPayResponse.current_start * 1000)
      : null,
    currentEnd: razorPayResponse.current_end
      ? new Date(razorPayResponse.current_end * 1000)
      : null,
    endedAt: razorPayResponse.ended_at
      ? new Date(razorPayResponse.ended_at * 1000)
      : null,
    quantity: razorPayResponse.quantity,
    notes: razorPayResponse.notes,
    chargeAt: razorPayResponse.charge_at
      ? new Date(razorPayResponse.charge_at * 1000)
      : null,
    offerId: razorPayResponse.offer_id,
    startAt: razorPayResponse.start_at
      ? new Date(razorPayResponse.start_at * 1000)
      : null,
    endAt: razorPayResponse.end_at
      ? new Date(razorPayResponse.end_at * 1000)
      : null,
    authAttempts: razorPayResponse.auth_attempts,
    totalCount: razorPayResponse.total_count,
    paidCount: razorPayResponse.paid_count,
    customerNotify: razorPayResponse.customer_notify,
    createdAt: razorPayResponse.created_at
      ? new Date(razorPayResponse.created_at * 1000)
      : null,
    expireBy: razorPayResponse.expire_by,
    shortUrl: razorPayResponse.short_url,
    hasScheduledChanges: razorPayResponse.has_scheduled_changes,
    changeScheduledAt: razorPayResponse.change_scheduled_at,
    remainingCount: razorPayResponse.remaining_count,
  });
  createOrder.save(function (err, result) {
    if (err) {
      // logger.log('error', 'create subscription', {
      //   tags: 'advisory',
      //   additionalInfo: {
      //     errorMessage: err,
      //     err,
      //   },
      // });
      return next(err);
    }
    return res.status(200).json({
      success: true,
      message: 'Subscription is created sucessfully',
      orderId: result._id,
      razorPaySubscriptionOrderId: result.razorPaySubscriptionId,
    });
  });
}

async function createSubs(cart, billingId, res, next) {
  let razorPayPlanId;
  if (!cart.subscriptionPlanId.razorPayPlanId) {
    razorPayPlanId = await createPlan(
      cart.advisoryId.productTitle,
      cart.subscriptionPlanId
    );
  } else {
    razorPayPlanId = cart.subscriptionPlanId.razorPayPlanId;
  }
  const userId = res.locals.user._id;

  // logger.log('info', 'create subscription', {
  //   tags: 'advisory',
  //   additionalInfo: {
  //     userId,
  //     cart,
  //     razorPayPlanId,
  //   },
  // });

  const razorPayResponse = await createSubscription(
    userId,
    cart.advisoryId.productTitle,
    razorPayPlanId,
    cart.subscriptionPlanId
  );
  // logger.log('info', 'razorPay create subscription response', {
  //   tags: 'advisory',
  //   additionalInfo: {
  //     razorPayResponse,
  //   },
  // });
  if (!razorPayResponse.id) {
    // logger.log('error', 'create subscription', {
    //   tags: 'advisory',
    //   additionalInfo: {
    //     razorPayResponse,
    //   },
    // });
    return next(razorPayResponse);
  }
  createSubscriptionOrder(
    userId,
    billingId,
    cart.advisoryId._id,
    razorPayResponse,
    cart.gst,
    next,
    res
  );
}

const createBilling = async (billingDetails) => {
  try {
    const billing = await BillingModel.create(billingDetails);
    return billing._id;
  } catch (error) {
    console.log(error);
    throw new Error('Could not create billing details');
  }
};

// const advisory = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     logger.log('error', 'advisory request error', {
//       tags: 'advisory',
//       additionalInfo: { errorMessage: errors.array() },
//     });
//     return res.status(400).json({
//       success: false,
//       message: 'Check errors below',
//       errors: errors.array(),
//     });
//   }
//   const { id, gstNo, billingDetails } = req.body;
//   try {
//     const cart = await CartModel.findOne({ _id: id }).lean().exec();
//     if (!cart) {
//       logger.log('error', 'advisory request error', {
//         tags: 'advisory',
//         additionalInfo: {
//           errorMessage: 'Cart Id not found in the selected Advisory',
//         },
//       });
//       return next('Cart Id not found in the selected Advisory');
//     }
//     if (!cart.documentId) {
//       logger.log('error', 'advisory request error', {
//         tags: 'advisory',
//         additionalInfo: {
//           errorMessage:
//             'E-Sign is mandatory for subscription, please generate the document and proceed on e-sign',
//         },
//       });
//       return next(
//         'E-Sign is mandatory for subscription, please generate the document and proceed on e-sign'
//       );
//     }

//     // const billingId = await createBilling(billingDetails);
//     const billingId = null;

//     if (gstNo) {
//       await CartModel.findOneAndUpdate({ _id: id }, { $set: { gst: gstNo } });
//     }
//     if (cart.isESignRequire) {
//       const agreementStatus = await getDocumentStatus(cart.documentId);
//       if (agreementStatus === 'requested') {
//         return next(
//           'E-Sign is mandatory for subscription, please complete e-sign and come back'
//         );
//       } else if (agreementStatus === 'expired') {
//         return next(
//           'E-Sign is mandatory for subscription, this document is expired please create a new order'
//         );
//       } else if (agreementStatus === 'completed') {
//         return await createSubs(cart, billingId, res, next);
//       } else {
//         return next('E-Sign is mandatory for subscription');
//       }
//     } else {
//       return await createSubs(cart, billingId, res, next);
//     }
//   } catch (error) {
//     logger.log('error', 'advisory request error', {
//       tags: 'advisory',
//       additionalInfo: {
//         errorMessage: error.message,
//         error,
//       },
//     });
//     console.log(error);
//     next(error);
//   }
// };

const advisory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // logger.log('error', 'advisory request error', {
    //   tags: 'advisory',
    //   additionalInfo: { errorMessage: errors.array() },
    // });
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }

  const { id, gstNo, billingDetails } = req.body;

  try {
    const cart = await CartModel.findOne({ _id: id });

    if (!cart) {
      return next('Cart Id not found in the selected Advisory');
    }
    if (!cart.documentId) {
      return next(
        'E-Sign is mandatory for subscription, please generate the document and proceed on e-sign'
      );
    }
    if (!cart.isESignComplete) {
      return next(
        'E-Sign is mandatory for subscription, please complete e-sign'
      );
    }
    if (gstNo) {
      cart.gst = gstNo;
      await cart.save();
    }
    let subscription;
    const existingSubscription = await SubscriptionModel.findOne({
      advisoryId: cart.advisoryId,
      userId: cart.userId,
      planId: cart.subscriptionPlanId,
    });

    if (existingSubscription) {
      subscription = existingSubscription;
    } else {
      subscription = await SubscriptionModel.create({
        advisoryId: cart.advisoryId,
        userId: cart.userId,
        planId: cart.subscriptionPlanId,
      });
    }
    const orderId = new mongoose.Types.ObjectId();
    let amounttopay 
    amounttopay =(cart.subscriptionPlanId.discountedPrice || cart.subscriptionPlanId.actualPrice) * 100  
    if(cart.couponId){
      amounttopay  = cart.amount*100
    }
    const orderDetails = {
      amount:amounttopay,
      id: orderId,
      userId: cart.userId._id,
      type: 'Advisory',
      productIds: cart.advisoryId._id,
    };
    const razorPayResponse = await createRazorPayOrder(orderDetails);
    if (!razorPayResponse.id) {
      return next(razorPayResponse);
    }
    const order = await OrderModel.create({
      _id: orderId,
      advisoryId: cart.advisoryId,
      subscriptionId: subscription._id,
      userId: cart.userId,
      totalAmount: orderDetails.amount,
      razorPayOrderId: razorPayResponse.id,
      amount: razorPayResponse.amount,
      amount_paid: razorPayResponse.amount_paid,
      amount_due: razorPayResponse.amount_due,
      currency: razorPayResponse.currency,
      notes: razorPayResponse.notes,
      receipt: razorPayResponse.receipt,
      status: razorPayResponse.status,
      attempts: razorPayResponse.attempts,
      created_at: razorPayResponse.created_at
        ? new Date(razorPayResponse.created_at * 1000)
        : null,
      gst: cart.gst,
      agreementId: cart.documentId,
      CouponID:cart.couponId?cart.couponId:"No Coupon applied"
    });

    res.status(200).json({
      success: true,
      message: 'Order is created successfully',
      amountToBePaid: order.totalAmount,
      orderId: order._id,
      razorPayOrderId: order.razorPayOrderId,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const superCourse = async (req, res, next) => {
  const { superCourseId, billingDetails } = req.body;
  const superCourse = await SuperCourseModel.findOne({
    superCourseId: superCourseId,
  })
    .lean()
    .exec();
  const userId = res.locals.user._id;
  const orderId = new mongoose.Types.ObjectId();
  const orderDetails = {
    amount: superCourse.priceIds[0].actualPrice * 100,
    id: orderId,
    userId: userId,
    type: courseType[superCourse.supercourseType],
    productIds: [superCourseId],
  };
  try {
    const billingId = await createBilling(billingDetails);
    const razorPayResponse = await createRazorPayOrder(orderDetails);
    if (!razorPayResponse.id) {
      return next(razorPayResponse);
    }
    createOrder(
      userId,
      billingId,
      (superCourse.priceIds[0].discountedPrice ||
        superCourse.priceIds[0].actualPrice) * 100,
      superCourseId,
      razorPayResponse,
      next,
      res
    );
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  superCourse,
  advisory,
};
