const mongoose = require('mongoose');
const {Schema} = mongoose;

// this is constructed in order to build relation to FO BhavCopy
const strikePriceSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: [true, "strike price number must be unique"],
    },
    instruments : {
        type: [Schema.Types.ObjectId],
        ref: 'instrument',
        default: []
    },
    symbols : {
        type: [Schema.Types.ObjectId],
        ref: 'symbols',
        default: []
    },
    expiryDates : {
        type: [Schema.Types.ObjectId],
        ref: 'expiryDate',
        default: []
    }
},{ timestamps: true })

module.exports = mongoose.model('strikePrice', strikePriceSchema);