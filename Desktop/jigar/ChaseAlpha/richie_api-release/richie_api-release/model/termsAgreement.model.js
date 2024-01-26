const mongoose = require('mongoose');
const {Schema} = mongoose;

const termsAgreementSchema = new mongoose.Schema({
    termsAgreementId: Schema.Types.ObjectId,
    termsAgreementTitle: {
        type: String,
        required: true,
    },
    termsAgreement: {
        type: String,
        required: true,
    },
    termsEffectiveDate: {
        type: Date,
        required: true,
    }
}, {versionKey: false});

module.exports = mongoose.model('termsAgreement', termsAgreementSchema);
