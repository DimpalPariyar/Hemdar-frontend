const mongoose = require('mongoose');

const privacyAgreementSchema = new mongoose.Schema({
    privacyAgreementId: {
        type: String,
        required: true,
        default: () => mongoose.Types.ObjectId()
    },
    privacyAgreementTitle: {
        type: String,
        required: true,
    },
    privacyAgreement: {
        type: String,
        required: true,
    },
    privacyEffectiveDate: {
        type: Date,
        required: true,
    }
}, {versionKey: false});

module.exports = mongoose.model('privacyAgreement', privacyAgreementSchema);
