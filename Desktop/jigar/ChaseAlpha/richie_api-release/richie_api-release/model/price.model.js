const mongoose = require('mongoose');
const _ = require('lodash');

const priceSchema = new mongoose.Schema(
  {
    priceName: {
      type: String,
    },
    numOfSessions: {
      type: Number,
      default: 1,
    },
    actualPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: null,
    },
    bestSeller: {
      type: Boolean,
      default: false,
    },
    bannerImage: {
      type: String,
    },
    deActivated: {
      type: Boolean,
      default: false,
    },
    validityPeriodInDays: {
      type: Number,
      default: 0,
    },
    razorPayPlanId: {
      type: String,
      required: false,
    },
  },
  { versionKey: false }
);

priceSchema.pre('save', function (next) {
  if (_.isNull(this.discountedPrice)) {
    this.discountedPrice = this.get('actualPrice');
  }
  next();
});

const SessionPlans = mongoose.model('sessionPlans', priceSchema);
const PriceModel = mongoose.model('price', priceSchema);

module.exports = {
  SessionPlans,
  PriceModel,
};
