const mongoose = require('mongoose');

const termsAgreementsSchema = new mongoose.Schema({
    termsAgreementsIds: [String]
}, {versionKey: false});

termsAgreementsSchema.virtual("termsAgreements", {
    ref: "termsAgreement",
    localField: ["termsAgreementsIds"],
    foreignField: ["termsAgreementId"],
});

module.exports = mongoose.model('termsAgreementGroup', termsAgreementsSchema);
