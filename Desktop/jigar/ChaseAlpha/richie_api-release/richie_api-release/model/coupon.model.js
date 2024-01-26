const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new mongoose.Schema({
    couponCode:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
    },
    discountType: {
        type:String,
        required:true,
    },
    percentage: {
        type:Number
    },
    amount: {
        type:Number,
    },
    couponExpiry: {
        type:Date,
        required:true,
    },
    minSpend:{
        type:Number,
        required:true,
    },
    maxSpend: {
        type:Number,
        required:true
    },
    notForSaleCoupon:{
        type:Boolean,
    },
    singleUsedCoupon: {
        type:Boolean,
    },
    listOfProduct:{
        // productIds
        type: [Schema.Types.ObjectId],
        ref: 'product',
        default: [],
      },
    excludeProdList: [{type:String}],
    listOfCategory:[{type:String}],
    excludeCatList: [{type:String}],
    allowedEmail:{
        // userIds
        type: [Schema.Types.ObjectId],
        ref: 'users',
        default: [],
      },
    redeem: {
        type:String,
        required:true
    },
    enableCoupon:{
        type:Boolean,
        required:true,
    },
    redeemUserId:[{type:Schema.Types.ObjectId,ref:'Users'}]
    
},
{
    timestamps: true,
  }
  )

  module.exports = mongoose.model('coupons',couponSchema)