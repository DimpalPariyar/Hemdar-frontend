const ProductModel = require('../model/product.model');
const _ = require('lodash');
const CartModel = require('../model/cart.model');
const SubscriptionOrderModel = require('../model/subscriptionOrder.model');
const { validationResult } = require('express-validator');
const {
  generateDocumentAndRequestSign,
  signInternal,
  getDocumentStatus,
  getDocumentSignedStatus,
} = require('../service/digio_service');
const { cancelSubscription } = require('../service/razorpay_service');
const { updateSubsOnDb } = require('../utils/razorpayMap');
const { sendService } = require('../service/slack_service');
const { removeAdvisoryToUser } = require('./payment.controller');
// const logger = require('../utils/logger');

const eSign = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  try {
    const { id, identifier } = req.body;
    const cart = await CartModel.findOne({ _id: id });
    if (!cart) {
      return next({
        message: 'Cart Id not found in the selected Advisory',
        status: 404,
      });
    }
    if (!cart.userId.email) {
      return next({
        message: 'Email is required for E-Signing, please update your profile',
        status: 400,
      });
    }
    if (!cart.userId.name) {
      return next({
        message: 'Name is required for E-Signing, please update your profile',
        status: 400,
      });
    }
    if (!cart.userId.address) {
      return next({
        message:
          'Address is required for E-Signing, please update your profile',
        status: 400,
      });
    }
    if (!cart.userId.panNumber) {
      return next({
        message:
          'PAN Number is required for E-Signing, please update your profile',
        status: 400,
      });
    }
    if (!cart.userId.mobile) {
      return next({
        message:
          'Mobile Number is required for E-Signing, please update your profile',
        status: 400,
      });
    }
    if (!cart.userId.score) {
      return next({
        message:
          'Risk profile is required for E-Signing, please update your profile',
        status: 400,
      });
    }
    if (!cart.advisoryId.hostProfileId.email) {
      return next({
        message: "This Advisor don't have Email attached to his profile",
        status: 400,
      });
    }
    if (!cart.advisoryId.hostProfileId.address) {
      return next({
        message: "This Advisor don't have Address on his Profile",
        status: 400,
      });
    }
    if (!cart.advisoryId.hostProfileId.phoneNumber) {
      return next({
        message: "This Advisor don't have Mobile on his Profile",
        status: 400,
      });
    }
    if (!cart.subscriptionPlanId.priceName) {
      return next({
        message: "This Advisory Plan don't have Plan Name",
        status: 400,
      });
    }
    if (cart.documentId) {
      const { principleSigned, userSigned, expired } =
        await getDocumentSignedStatus(cart.documentId);
      if (!expired) {
        if (!userSigned) {
          let identifierType;
          if (identifier === 'email') {
            identifierType = cart.userId.email;
          } else if (identifier === 'mobile') {
            identifierType = cart.userId.mobile;
          }
          return res.status(200).json({
            documentId: cart.documentId,
            identifier: identifierType,
          });
        }
        if (userSigned && !principleSigned) {
          try {
            await signInternal(cart.documentId);
            cart.isESignComplete = true;
            await cart.save();
            return res.status(200).send({
              message: 'Signed successfully',
              principleESign: true,
            });
          } catch (error) {
            return res.status(500).send({
              message: 'Company signature failed, please try again',
              principleESign: false,
            });
          }
        }
        return res.status(200).send({
          message: 'Signed successfully',
          principleESign: true,
        });
      }
    }
    const user = {
      email: cart.userId.email,
      name: cart.userId.name,
      address: cart.userId.address,
      panNumber: cart.userId.panNumber,
      mobile: cart.userId.mobile,
      _id: cart.userId._id,
      riskScore: cart.userId.score,
    };
    const advisor = {
      email: cart.advisoryId.hostProfileId.email,
      address: cart.advisoryId.hostProfileId.address,
      phone: cart.advisoryId.hostProfileId.phoneNumber,
    };
    const product = {
      title: cart.advisoryId.productTitle,
      plan_name: cart.subscriptionPlanId.priceName,
      amount:
        cart.subscriptionPlanId.discountedPrice ||
        cart.subscriptionPlanId.amountPrice,
    };

    // logger.log('info', 'entering generateDocuments Sign', {
    //   tags: 'eSign',
    // });

    const data = await generateDocumentAndRequestSign(
      user,
      identifier,
      product,
      advisor
    );

    cart.documentId = data.documentId;
    await cart.save();

    // logger.log('info', 'generated documents Sign', {
    //   tags: 'eSign',
    //   additionalInfo: { data },
    // });

    return res.status(200).json(data);
  } catch (e) {
    // logger.log('error', 'esign error', {
    //   tags: 'http',
    //   additionalInfo: { errorMessage: e.message, error: e },
    // });
    console.log(e);
    if (
      e !== null &&
      e.response !== null &&
      e.response.status !== null &&
      e.response.status === 403 &&
      e.response.data.code === 'NOT_SUFFICIENT_ENTITLEMENTS'
    ) {
      await sendService('On the digio account: ' + e.response.data.message);
      return res.status(402).json(e.response.data);
    } else if (
      e !== null &&
      e.response !== null &&
      e.response.status !== null
    ) {
      return res.status(e.response.status).json(e.response.data);
    } else {
      next(e);
    }
  }
};

const cancelSubs = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  try {
    const { id, cancelAtCycleEnd } = req.body;
    const subscription = await SubscriptionOrderModel.findOne({ _id: id })
      .lean()
      .exec();
    const isTest = process.env.NODE_ENV !== 'production';
    let data;
    if (isTest) {
      data = await SubscriptionOrderModel.findOneAndUpdate(
        { _id: subscription._id },
        {
          $set: {
            status: 'cancelled',
          },
        },
        { new: true }
      );
    } else {
      const razorPayResponse = await cancelSubscription(
        subscription.razorPaySubscriptionId,
        cancelAtCycleEnd
      );
      data = await updateSubsOnDb(
        subscription._id,
        undefined,
        razorPayResponse
      );
    }
    if (!cancelAtCycleEnd) {
      await removeAdvisoryToUser(data);
    }
    res.status(200).send(data);
  } catch (e) {
    console.log(e.message);
    res.status(500).send(e);
  }
};
const addToCart = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Check errors below',
      errors: errors.array(),
    });
  }
  try {
    const { id, planId, isESignMandatory } = req.body;
    const advisory = await ProductModel.findOne({ _id: id }).lean().exec();
    const selectedPlan = _.find(
      advisory.subscriptionPlanIds,
      (plan) => plan._id.toString() === planId
    );
    if (!selectedPlan) {
      return next({
        message: 'Plan Id not found in the selected Advisory',
        status: 400,
      });
    }

    const existingCart = await CartModel.findOne({
      userId: res.locals.user._id,
      subscriptionPlanId: selectedPlan._id,
      advisoryId: id,
    });
    
    let gst9percent;
    let billTotal;

    if (existingCart) {
      gst9percent =
        ((existingCart.subscriptionPlanId.discountedPrice ??
          existingCart.subscriptionPlanId.actualPrice) *
          9) /
        100;
      billTotal =
        (existingCart.subscriptionPlanId.discountedPrice ??
          existingCart.subscriptionPlanId.actualPrice) +
        gst9percent * 2;

      if(existingCart.couponId !== undefined){
        existingCart.amount = billTotal
        existingCart.save()
        await CartModel.findOneAndUpdate({_id:existingCart._id},{$unset:{couponId:1}})
      }

      if (!existingCart.documentId) {
        const response = {
          message: 'E-Sign is mandatory',
          _id: existingCart._id,
          plan: existingCart.subscriptionPlanId,
          total:
            existingCart.subscriptionPlanId.discountedPrice ??
            existingCart.subscriptionPlanId.actualPrice,
          igst: gst9percent,
          cgst: gst9percent,
          billTotal: billTotal,
          customerESign: false,
          principleESign: false,
        };
        return res.status(200).json(response);
      }

      const { principleSigned, userSigned, expired } =
        await getDocumentSignedStatus(existingCart.documentId);
      if (!expired) {
        if (!userSigned) {
          const response = {
            message: 'E-Sign is mandatory',
            _id: existingCart._id,
            plan: existingCart.subscriptionPlanId,
            total:
              existingCart.subscriptionPlanId.discountedPrice ??
              existingCart.subscriptionPlanId.actualPrice,
            igst: gst9percent,
            cgst: gst9percent,
            billTotal: billTotal,
            customerESign: false,
            principleESign: false,
          };
          return res.status(200).json(response);
        }
        if (userSigned && !principleSigned) {
          const response = {
            message: 'E-Sign is mandatory',
            _id: existingCart._id,
            plan: existingCart.subscriptionPlanId,
            total:
              existingCart.subscriptionPlanId.discountedPrice ??
              existingCart.subscriptionPlanId.actualPrice,
            igst: gst9percent,
            cgst: gst9percent,
            billTotal: billTotal,
            customerESign: true,
            principleESign: false,
            documentId: existingCart.documentId,
          };
          return res.status(200).json(response);
        }
        const response = {
          message: 'E-Sign is mandatory',
          _id: existingCart._id,
          plan: existingCart.subscriptionPlanId,
          total:
            existingCart.subscriptionPlanId.discountedPrice ??
            existingCart.subscriptionPlanId.actualPrice,
          igst: gst9percent,
          cgst: gst9percent,
          billTotal: billTotal,
          customerESign: true,
          principleESign: true,
        };
        return res.status(200).json(response);
      }

      await existingCart.remove();
    }

    gst9percent =
      ((selectedPlan.discountedPrice ?? selectedPlan.actualPrice) * 9) / 100;
    billTotal =
      (selectedPlan.discountedPrice ?? selectedPlan.actualPrice) +
      gst9percent * 2;

    const cart = new CartModel({
      userId: res.locals.user._id,
      amount: billTotal,
      subscriptionPlanId: selectedPlan,
      advisoryId: id,
      isESignRequire: isESignMandatory,
      isESignComplete: false,
    });

    cart.save(function (err, result) {
      if (err) {
        return next(err);
      }
      const response = {
        message: 'E-Sign is mandatory',
        _id: result._id,
        plan: selectedPlan,
        total: selectedPlan.discountedPrice ?? selectedPlan.actualPrice,
        igst: gst9percent,
        cgst: gst9percent,
        billTotal: billTotal,
        customerESign: false,
        principleESign: false,
      };
      return res.status(200).json(response);
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

const principleESign = async (req, res, next) => {
  const { documentId } = req.body;
  try {
    await signInternal(documentId);
    await CartModel.updateOne(
      {
        documentId,
      },
      {
        isESignComplete: true,
      }
    );
    res.status(200).send({
      message: 'Principle signed successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  addToCart,
  eSign,
  cancelSubs,
  principleESign,
};
