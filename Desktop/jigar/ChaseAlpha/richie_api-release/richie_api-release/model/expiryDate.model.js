const mongoose = require('mongoose');
const {Schema} = mongoose;

// this is constructed in order to build relation to FO BhavCopy
const expiryDateSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: [true, "Name must be unique"],
    },
    expiryDate:{
        type: Date, required: true
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
    }
},{ timestamps: true })

module.exports = mongoose.model('expiryDate', expiryDateSchema);