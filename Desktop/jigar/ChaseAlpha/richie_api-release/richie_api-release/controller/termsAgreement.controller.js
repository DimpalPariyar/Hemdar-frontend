const mongoose = require('mongoose');
const _ = require('lodash');
const TermsAgreement = require("../model/termsAgreement.model");
const TermsAgreementGroup = require("../model/termsAgreementGroup.model");

const getLatestTermsAgreement = async (req, res, next) => {
    try {
        const currentTimestamp = new Date();
        // let currentTimestamp = d.toISOString();
        TermsAgreement.find({termsEffectiveDate: {$lte: currentTimestamp}}).select('-_id'). //removes "_id"
            sort({"termsEffectiveDate": -1}). //sort descending
            limit(1). //not necessary
            exec(function (err, termsAgreements) {
                if (err) return next(err);
                if (termsAgreements.length > 0) {
                    return res.status(200).json(termsAgreements.shift());
                } else {
                    return res.status(200).json(null);
                }
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const getAllTermsAgreements = async (req, res, next) => {
    try {
        TermsAgreementGroup.findOne({}).select('-_id'). //removes "_id"
            populate('termsAgreements').lean().exec(function (err, termsAgreementGroup) {
            if (err) return next(err);
            if (termsAgreementGroup) {
                const {termsAgreementsIds, ...cleanedAgreementGroup} = termsAgreementGroup;
                let cleanedTermsAgreements = cleanedAgreementGroup.termsAgreements.map(({_id, ...rest}) => {
                    return rest;
                });
                return res.status(200).json(cleanedTermsAgreements);
            }
            return res.status(200).json(termsAgreementGroup);
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const getOneTermsAgreement = async (req, res, next) => {
    try {
        const termsAgreementId = req.params.termsAgreementId;

        const count = await TermsAgreement.countDocuments({termsAgreementId: termsAgreementId});
        //check termsAgreementId existence
        if (count === 0) {
            return res.status(422).json({
                success: false,
                message: `No Terms and condition agreement found with termsAgreementId: ${termsAgreementId}`
            });
        }

        TermsAgreement.findOne({termsAgreementId: termsAgreementId}).select('-_id'). //removes "_id"
            lean().exec(function (err, termsAgreement) {
            if (err) return next(err);
            return res.status(200).json(termsAgreement);
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const addTermsAgreement = async (req, res, next) => {
    try {
        const {agreementData, agreementTitle, effectiveDate} = req.body
        //check body contains all data
        if (!agreementData || !agreementTitle || !effectiveDate) {
            return res.status(422).json({
                success: false,
                message: "Please add agreementData, agreementTitle and effectiveDate in the request body"
            });
        }

        const termAgreement = new TermsAgreement({
            termsAgreementId: new mongoose.Types.ObjectId(),
            termsAgreementTitle: agreementTitle,
            termsAgreement: agreementData,
            termsEffectiveDate: effectiveDate
        });
        termAgreement.save(function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong, couldn't update the terms and condition agreement",
                });
            } else {
                TermsAgreementGroup.updateOne({},
                    {$push: {termsAgreementsIds: termAgreement.termsAgreementId}},
                    {upsert: true},
                    function (err) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Something went wrong, couldn't update the terms and condition agreement",
                            });
                        }
                        return res.status(201).json({
                            success: true,
                            termsAgreementId: termAgreement.termsAgreementId,
                            message: "New terms and condition agreement is created sucessfully"
                        });
                    });
            }
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const modifyOneTermsAgreement = async (req, res, next) => {
    try {
        const termsAgreementId = req.params.termsAgreementId;
        const {agreementData, agreementTitle, effectiveDate} = req.body

        //check body contains atleast one data
        if (!agreementData && !agreementTitle && !effectiveDate) {
            return res.status(422).json({
                success: false,
                message: "Please add agreementData, agreementTitle or effectiveDate in the request body"
            });
        }
        //check if agreement exists already
        const count = await TermsAgreement.countDocuments({termsAgreementId: termsAgreementId});
        if (count === 0) {
            return res.status(422).json({
                success: false,
                message: `No Terms and condition agreement found with termsAgreementId: ${termsAgreementId}`
            });
        }
        TermsAgreement.updateOne({termsAgreementId: termsAgreementId},
            {
                $set: {
                    termsAgreementTitle: agreementTitle,
                    termsAgreement: agreementData,
                    termsEffectiveDate: effectiveDate
                }
            }, function (err) {
                if (err) {
                    return res.status(500).json({
                        message: "Something went wrong, couldn't update the terms and condition agreement",
                    });
                } else {
                    return res.status(201).json({
                        success: true,
                        message: "Terms and conditions agreement is updated sucessfully"
                    });
                }
            });
    } catch (e) {
        console.log(e)
        next(e)
    }
};

const deleteOneTermsAgreement = async (req, res, next) => {
    try {
        const termsAgreementId = req.params.termsAgreementId;
        //check if agreement exists already
        const count = await TermsAgreement.countDocuments({termsAgreementId: termsAgreementId});
        if (count === 0) {
            return res.status(422).json({
                success: false,
                message: `There is no Terms and conditions agreement with termsAgreementId: ${termsAgreementId} to delete`
            });
        }
        TermsAgreement.deleteOne({termsAgreementId: termsAgreementId}, function (err) {
            if (err) {
                next(err);
            }
            TermsAgreementGroup.updateOne({},
                {$pull: {termsAgreementsIds: termsAgreementId}},
                function (err) {
                    if (err) {
                        return next(err);
                    } else {
                        return res.status(201).json({
                            success: true,
                            message: `Terms and conditions agreement with termsAgreementId: ${termsAgreementId} is deleted successfully`
                        });
                    }
                });
        });
    } catch (e) {
        console.log(e)
        next(e)
    }
};


module.exports = {
    addTermsAgreement,
    getAllTermsAgreements,
    getOneTermsAgreement,
    modifyOneTermsAgreement,
    deleteOneTermsAgreement,
    getLatestTermsAgreement
};
