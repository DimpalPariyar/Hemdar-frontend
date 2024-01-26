const ContactModel = require("../model/contact.model");
const {validationResult} = require("express-validator");
const {triggerOTPService} = require("./otp.controller");
const OTPModel = require("../model/otp.model");

async function saveContact(res, req, isVerified) {
    const userId = res.locals.user._id;
    const mobile = req.body.mobile;
    const name = req.body.name;
    await ContactModel.findOneAndUpdate(
        { mobile: mobile },
        { userId: userId, mobile: mobile, name: name, isVerified: isVerified },
        { upsert: true, new: true }
    );
}

const verify = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            "success": false, "message": "Check errors below", errors: errors.array()
        });
    }
    if (res.locals.user.mobile === req.body.mobile) {
        // Already verified number
        await saveContact(res, req, true);
        return res.status(200).json({message: "Already verified, we will contact you soon"});
    }else{
        // Different number
        await saveContact(res, req, false);
        await triggerOTPService(req.body.mobile,undefined, res, next)
    }
}

const verifyOTP = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            "success": false, "message": "Check errors below", errors: errors.array()
        });
    }

    const otp = req.body.otp;
    const mobile = req.body.mobile;
    const validOTP = await OTPModel.findOne({
        mobile,
        undefined,
        otp,
        status: 0,
        expireIn: {$gte: new Date().getTime()},
    });

    if(validOTP){
        await saveContact(res, req, true);
        return res.status(200).json({message: "Verified, we will contact you soon"});
    }else{
        next("OTP invalid")
    }

}

module.exports = {
    verify,
    verifyOTP
}