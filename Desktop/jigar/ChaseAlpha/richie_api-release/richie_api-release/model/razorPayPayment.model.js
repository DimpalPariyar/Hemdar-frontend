const mongoose = require('mongoose');

const razorPayPaymentSchema = new mongoose.Schema({
    razorPayPaymentId :{
        type: String,
        required: false,
        unique: true,
    },
    entity :{
        type: String,
        required: false,
    },
    listGst:{
        type: Number,
        required: false
    },
    listAmount:{
        type: Number,
        required: false
    },
    amount :{
        type: String,
        required: false,
    },
    currency :{
        type: String,
        required: false,
    },
    status :{
        type: String,
        required: false,
    },
    order_id :{
        type: String,
        required: false,
    },
    invoice_id :{
        type: String,
        required: false,
    },
    international :{
        type: String,
        required: false,
    },
    method :{
        type: String,
        required: false,
    },
    amount_refunded :{
        type: String,
        required: false,
    },
    refund_status :{
        type: String,
        required: false,
    },
    captured :{
        type: String,
        required: false,
    },
    description :{
        type: String,
        required: false,
    },
    card_id :{
        type: String,
        required: false,
    },
    bank :{
        type: String,
        required: false,
    },
    wallet :{
        type: String,
        required: false,
    },
    vpa :{
        type: String,
        required: false,
    },
    email :{
        type: String,
        required: false,
    },
    contact :{
        type: String,
        required: false,
    },
    notes: {
        type: [],
        required: false
    },
    fee:{
        type:String,
        required: false,
    },
    tax:{
        type:String,
        required: false,
    },
    error_code:{
        type:String,
        required: false,
    },
    error_description:{
        type:String,
        required: false,
    },
    error_source:{
        type:String,
        required: false,
    },
    error_step:{
        type:String,
        required: false,
    },
    error_reason:{
        type:String,
        required: false,
    },
    acquirer_data:{
        type:String,
        required: false,
    },
    created_at:{
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('razorPayPayment', razorPayPaymentSchema)