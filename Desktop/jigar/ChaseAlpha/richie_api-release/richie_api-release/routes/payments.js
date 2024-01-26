const express = require('express');
const router = express.Router();
const checkAuth = require('../utils/checkAuth');
const checkValidId = require('../middlewares/checkValidId');
const paymentController = require('../controller/payment.controller');
const OrderModel = require('../model/order.model');

router.post('/confirm/learn', checkAuth.hasUserPermission, (req, res, next) =>
  paymentController.verify(req, res, next)
);

router.post(
  '/confirm/advisory',
  checkAuth.hasUserPermission,
  (req, res, next) => paymentController.verifyAdvisory(req, res, next)
);

router.post(
  '/invoice/',
  [
    // checkAuth.isValid, 
    checkValidId(OrderModel, 'orderId'),
  ],
  (req, res, next) => paymentController.getInvoice(req, res, next)
);

router.get('/invoiceforall',(req,res,next)=>paymentController.getInvoiceForAll(req,res,next))
router.post(
  '/invoice/email',
  [checkAuth.hasSuperAdminPermission],
  (req, res, next) => paymentController.sendEmailInvoice(req, res, next)
);

router.post('/razorpay/', (req, res, next) =>
  paymentController.razorpayWebhook(req, res, next)
);

router.get(
  '/razorpay/env',
  checkAuth.hasUserPermission,
  paymentController.checkPaymentEnvironment
);

module.exports = router;
