const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriptionOrderSchema = new mongoose.Schema(
  {
    razorPaySubscriptionId: {
      type: String,
      required: true,
    },
    advisoryId: {
      type: Schema.Types.ObjectId,
      ref: 'product',
    },
    billingId: {
      type: Schema.Types.ObjectId,
      ref: 'billing',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    planId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: false,
    },
    totalCount: {
      type: Number,
    },
    customerNotify: {
      type: Boolean,
    },
    startAt: {
      type: Date,
    },
    quantity: {
      type: Number,
    },
    notes: {
      type: [],
      required: false,
    },
    status: {
      type: String,
      required: true,
    },
    paidCount: {
      type: Number,
      required: true,
    },
    currentStart: {
      type: Date,
    },
    currentEnd: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    chargeAt: {
      type: Date,
    },
    offerId: {
      type: String,
    },
    endAt: {
      type: Date,
    },
    authAttempts: {
      type: Number,
    },
    createdAt: {
      type: Date,
    },
    expireBy: {
      type: Date,
    },
    shortUrl: {
      type: String,
    },
    hasScheduledChanges: {
      type: Boolean,
    },
    changeScheduledAt: {
      type: String,
    },
    remainingCount: {
      type: Number,
    },
    gst: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const autoPopulateFields = function (next) {
  this.populate('billingId');
  this.populate(
    'userId',
    'mobile email name -activeSubscriptions -purchasedSessions -subscribedAdvisories'
  );
  this.populate(
    'advisoryId',
    'productTitle -hostProfileId -subscriptionPlanIds'
  );
  this.select('+isClosingAtEndOfMonth');
  next();
};

subscriptionOrderSchema.virtual('advisoryInformation', {
  ref: 'product',
  localField: 'advisoryId',
  foreignField: 'id',
});

subscriptionOrderSchema.virtual('type').get(function () {
  if (this.advisoryId) {
    return 'advisory';
  } else {
    return 'Order Failed';
  }
});

subscriptionOrderSchema.virtual('isClosingAtEndOfMonth').get(function () {
  if (this.chargeAt == null && this.status === 'active') {
    return true;
  } else if (this.advisoryId) {
    return false;
  }
});

subscriptionOrderSchema
  .pre('findOne', autoPopulateFields)
  .pre('find', autoPopulateFields);

module.exports = mongoose.model('subscriptionOrder', subscriptionOrderSchema);
