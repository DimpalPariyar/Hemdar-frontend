const express = require('express');
const checkAuth = require('../utils/checkAuth');
const { check } = require('express-validator');
const checkValidId = require('../middlewares/checkValidId');
const router = express.Router();
const subscriptionController = require('../controller/subscription.controller');
const Product = require('../model/product.model');
const User = require('../model/user.model');

router.post('/check', subscriptionController.subscriptionCheck);

router.post(
  '/assign',
  checkAuth.hasSuperAdminPermission,
  subscriptionController.assignSubscription
);

router.post(
  '/cart',
  check('isESignMandatory', 'Please tell is it mandatory e-sign or not')
    .isBoolean()
    .toBoolean(),
  check('id', 'Please provide product').isString().isMongoId(),
  check('userId', 'Please provide user').isString().isMongoId(),
  check('planId', 'Please provide plan').isString().isMongoId().optional(),
  check('actualPrice', 'Please provide price').isInt().toInt().optional(),
  check('discountPercentage', 'Please provide discount percentage')
    .isInt()
    .toInt()
    .optional(),
  check('validityPeriodInDays', 'Please provide validity period')
    .isInt()
    .toInt()
    .optional(),
  checkValidId(Product, 'id'),
  checkValidId(User, 'userId'),
  checkAuth.hasSuperAdminPermission,
  subscriptionController.createCart
);

module.exports = router;
