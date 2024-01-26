const mongoose = require('mongoose');
const {Schema} = mongoose;

// this is constructed in order to build relation to FO BhavCopy
const symbolSchema = new mongoose.Schema({
    name: {
        type: String, required: true, unique: [true, "Name must be unique"],
    },
    instruments : {
        type: [Schema.Types.ObjectId],
        ref: 'instrument',
        default: []
    }
},{ timestamps: true })

module.exports = mongoose.model('symbol', symbolSchema);