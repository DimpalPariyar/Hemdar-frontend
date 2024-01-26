const mongoose = require('mongoose');
const { Schema } = mongoose;
const InvoiceCounter = new Schema({
    invoiceid: {
        type: String,
        required: true,
    },
    sequence: {
        type: Number,
        required: true,
    }
},{
    timestamps: true,
    versionKey: false
}
);

module.exports = mongoose.model('invoicecounter', InvoiceCounter);
