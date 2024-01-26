const express = require('express');
const router = express.Router();
const otpController = require("../controller/otp.controller");

/* POST login. */
router.post('/otp/send', otpController.sendOTP);
router.post('/otp/resend', otpController.reSendOTP);
router.post('/otp/verify', otpController.verify);

module.exports = router;
