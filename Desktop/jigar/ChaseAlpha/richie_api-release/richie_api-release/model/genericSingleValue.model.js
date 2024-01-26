const mongoose = require('mongoose');

const genericSingleValueSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: [true, "Name must be unique"],
    }, shortDescription: {
        type: String, required: false
    }, deActivate: {
        type: Boolean, default: false
    },
}, {
    versionKey: false, timestamps: true
});

const instrumentSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: [true, "Name must be unique"],
    }, shortDescription: {
        type: String, required: false
    }, deActivate: {
        type: Boolean, default: false
    },
    hasExpiry: {
        type: Boolean, default: false
    },
    hasStrikePrice:{
        type: Boolean, default: false
    }
}, {
    versionKey: false, timestamps: true
});

const market = mongoose.model('market', genericSingleValueSchema);
const instrument = mongoose.model('instrument', instrumentSchema);
const exchange = mongoose.model('exchange', genericSingleValueSchema);
const timeFrame = mongoose.model('timeFrame', genericSingleValueSchema);
const productType = mongoose.model('productType', genericSingleValueSchema);
const volatility = mongoose.model('volatility', genericSingleValueSchema);
const adviceStatus = mongoose.model('advice_status', genericSingleValueSchema);
const language = mongoose.model('language', genericSingleValueSchema);
const level = mongoose.model('level', genericSingleValueSchema);
module.exports = {
    market,
    instrument,
    exchange,
    timeFrame,
    productType,
    volatility,
    adviceStatus,
    language,
    level
}