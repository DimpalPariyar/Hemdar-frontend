const express = require('express');
const router = express.Router();
const otpController = require('../controller/otp.controller');
const checkAuth = require('../utils/checkAuth');

router.post(
  '/',
  [checkAuth.hasUserPermission, checkAuth.isAlreadyExist],
  (req, res, next) => otpController.sendOTP(req, res, next)
);

module.exports = router;
