const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  subscriptionPlanId: {
    type: Schema.Types.ObjectId,
    ref: 'price',
    required: false,
  },
  advisoryId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: false,
  },
  isESignRequire: {
    type: Boolean,
    required: true,
    default: false,
  },
  isESignComplete: {
    type: Boolean,
    default: false,
  },
  documentId: {
    type: String,
    required: false,
  },
  gst: {
    type: String,
    required: false,
  },
  couponId:{type:Schema.Types.ObjectId,ref:'coupons'},
});

const autoPopulateFields = function (next) {
  this.populate('userId');
  this.populate('subscriptionPlanId');
  this.populate('advisoryId');
  next();
};

cartSchema.virtual('subscriptionPlan', {
  ref: 'price',
  localField: ['subscriptionPlanId'],
  foreignField: ['id'],
});

cartSchema.virtual('user', {
  ref: 'Users',
  localField: ['userId'],
  foreignField: ['id'],
});

cartSchema.virtual('advisory', {
  ref: 'product',
  localField: ['advisoryId'],
  foreignField: ['id'],
});

cartSchema.pre('findOne', autoPopulateFields).pre('find', autoPopulateFields);

module.exports = mongoose.model('cart', cartSchema);
