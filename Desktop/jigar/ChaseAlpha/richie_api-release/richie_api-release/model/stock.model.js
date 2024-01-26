const mongoose = require('mongoose');

const stockModelSchema = new mongoose.Schema({
    trueDataSymbol: {
        required: true, type: String, unique: true
    },
    ltp: {
        required: true, type: Number
    }
});
stockModelSchema.index({trueDataSymbol:1})
module.exports = mongoose.model('stock', stockModelSchema);