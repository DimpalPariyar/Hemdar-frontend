const PrivacyAgreement = require("../model/privacyAgreement.model");

const getLatestPrivacyAgreement = async (req, res, next) => {
    try {
        const currentTimestamp = new Date();
        PrivacyAgreement.find({privacyEffectiveDate: {$lte: currentTimestamp}}).select('-_id'). //removes "_id"
            sort({"privacyEffectiveDate": -1}). //sort descending
            limit(1). //not necessary
            exec(function (err, privacyAgreements) {
                if (err) return next(err);
                if (privacyAgreements.length > 0) {
                    return res.status(200).json(privacyAgreements.shift());
                } else {
                    return res.status(200).json(null);
                }
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const getAllPrivacyAgreements = async (req, res, next) => {
    try {
        PrivacyAgreement.find({}).select('-_id'). //removes "_id"
            lean().exec(function (err, privacyAgreements) {
            if (err) return next(err);
            if (privacyAgreements.length > 0) {
                return res.status(200).json(privacyAgreements);
            } else {
                return res.status(200).json(null);
            }
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const getOnePrivacyAgreement = async (req, res, next) => {
    try {
        const privacyAgreementId = req.params.privacyAgreementId;

        const count = await PrivacyAgreement.countDocuments({privacyAgreementId: privacyAgreementId});
        //check termsAgreementId existence
        if (count === 0) {
            return res.status(422).json({
                success: false,
                message: `No Privacy agreement found with privacyAgreementId: ${privacyAgreementId}`
            });
        }
        PrivacyAgreement.findOne({privacyAgreementId: privacyAgreementId}).select('-_id'). //removes "_id"
            lean().exec(function (err, privacyAgreement) {
            if (err) return next(err);
            return res.status(200).json(privacyAgreement);
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const addPrivacyAgreement = async (req, res, next) => {
    try {
        const {agreementData, agreementTitle, effectiveDate} = req.body
        //check body contains all data
        if (!agreementData || !agreementTitle || !effectiveDate) {
            return res.status(422).json({
                success: false,
                message: "Please add agreementData, agreementTitle and effectiveDate in the request body"
            });
        }

        const privacyAgreement = new PrivacyAgreement({
            privacyAgreementTitle: agreementTitle,
            privacyAgreement: agreementData,
            privacyEffectiveDate: effectiveDate
        });
        privacyAgreement.save(function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong, couldn't update the Privacy agreement",
                });
            } else {
                return res.status(201).json({
                    success: true,
                    privacyAgreementId: privacyAgreement.privacyAgreementId,
                    message: "New Privacy agreement is created sucessfully"
                });
            }
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const modifyOnePrivacyAgreement = async (req, res, next) => {
    try {
        const privacyAgreementId = req.params.privacyAgreementId;
        const {agreementData, agreementTitle, effectiveDate} = req.body

        //check body contains atleast one data
        if (!agreementData && !agreementTitle && !effectiveDate) {
            return res.status(422).json({
                success: false,
                message: "Please add agreementData, agreementTitle or effectiveDate in the request body"
            });
        }
        //check if agreement exists already
        const count = await PrivacyAgreement.countDocuments({privacyAgreementId: privacyAgreementId});
        if (count === 0) {
            return res.status(422).json({
                success: false,
                message: `No Privacy agreement found with privacyAgreementId: ${privacyAgreementId}`
            });
        }
        PrivacyAgreement.updateOne({privacyAgreementId: privacyAgreementId},
            {
                $set: {
                    privacyAgreementTitle: agreementTitle,
                    privacyAgreement: agreementData,
                    privacyEffectiveDate: effectiveDate
                }
            }, function (err) {
                if (err) {
                    return res.status(500).json({
                        message: "Something went wrong, couldn't update the privacy agreement",
                    });
                } else {
                    return res.status(201).json({
                        success: true,
                        message: "Privacy agreement is updated sucessfully"
                    });
                }
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const deleteOnePrivacyAgreement = async (req, res, next) => {
    try {
        const privacyAgreementId = req.params.privacyAgreementId;
        //check if agreement exists already
        const count = await PrivacyAgreement.countDocuments({privacyAgreementId: privacyAgreementId});
        if (count === 0) {
            return res.status(422).json({
                success: false,
                message: `There is no privacy agreement with privacyAgreementId: ${privacyAgreementId} to delete`
            });
        }
        PrivacyAgreement.deleteOne({privacyAgreementId: privacyAgreementId}, function (err) {
            if (err) {
                next(err);
            } else {
                return res.status(201).json({
                    success: true,
                    message: `Privacy agreement with privacyAgreementId: ${privacyAgreementId} is deleted successfully`
                });
            }
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

module.exports = {
    getLatestPrivacyAgreement,
    getAllPrivacyAgreements,
    getOnePrivacyAgreement,
    addPrivacyAgreement,
    modifyOnePrivacyAgreement,
    deleteOnePrivacyAgreement
};
