const express = require('express');
const checkAuth = require("../utils/checkAuth");
const contactController = require("../controller/contact.controller");
const {check} = require("express-validator");
const router = express.Router();

router.post('/verify', checkAuth.hasUserPermission,
    check("mobile", "Please enter a valid mobile number")
        .exists({checkFalsy: true})
        .isNumeric()
        .isLength({min: 10, max: 10}),
    check("name", "Please send the name that the verify Pan API gave confirming with the user")
        .escape()
        .exists({checkFalsy: true}),
    (req, res, next) => contactController.verify(req, res, next));

router.post('/verifyOTP', checkAuth.hasUserPermission,
    check("mobile", "Please enter a valid mobile number")
        .exists({checkFalsy: true})
        .isNumeric()
        .isLength({min: 10, max: 10}),
    check("otp", "Please enter the valid OTP")
        .exists({checkFalsy: true})
        .isNumeric()
        .isLength({min: 6, max: 6}),
    (req, res, next) => contactController.verifyOTP(req, res, next));

module.exports = router;