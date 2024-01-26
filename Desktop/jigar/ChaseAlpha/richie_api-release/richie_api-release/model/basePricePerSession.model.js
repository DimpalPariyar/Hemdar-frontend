const mongoose = require('mongoose');
const {Schema} = mongoose;

const basePricePerSessionSchema = new mongoose.Schema({
    basePricePerSessionId: Schema.Types.ObjectId,
    actualPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('basePricePerSession', basePricePerSessionSchema);
