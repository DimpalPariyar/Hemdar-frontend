const express = require('express');
const router = express.Router();
const kycController = require("../controller/kyc.controller");
const checkAuth = require("../utils/checkAuth");
const {check} = require("express-validator");

router.post('/verify', checkAuth.hasUserPermission,
    check("panNumber", "Please enter a valid pan number")
        .escape()
        .exists({checkFalsy: true})
        .isLength({min: 10, max: 10})
        .matches(/[A-Z]{5}[0-9]{4}[A-Z]$/),
    (req, res, next) => kycController.verifyPan(req, res, next));

module.exports = router;
