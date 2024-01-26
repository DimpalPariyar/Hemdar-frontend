const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
    symbol: {
        type: String, required: true,
    },
    lotSize : {
        type: Number, required: true,
    },
    expiry :{
        type: String, required: true
    }
},{ timestamps: true })

module.exports = mongoose.model('lotSize', lotSchema);