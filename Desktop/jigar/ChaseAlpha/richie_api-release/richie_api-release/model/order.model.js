const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema(
  {
    orderId: String,
    superCourseId: [Schema.Types.ObjectId], // id of course or super course
    programId: {
      type: Schema.Types.ObjectId,
    },
    programSessions: {
      type: [Schema.Types.ObjectId],
      ref: 'programSession',
    },
    billingId: {
      type: Schema.Types.ObjectId,
      ref: 'billing',
    },
    advisoryId: {
      type: Schema.Types.ObjectId,
      ref: 'product',
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'subscription',
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    listGst: {
      type: Number,
      required: false,
    },
    listAmount: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    razorPayOrderId: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    amount_paid: {
      type: Number,
      required: false,
    },
    amount_due: {
      type: Number,
      required: false,
    },
    currency: {
      type: String,
      required: false,
    },
    notes: {
      type: [],
      required: false,
    },
    receipt: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: false,
    },
    attempts: {
      type: Number,
      required: false,
    },
    created_at: {
      type: Date,
      required: true,
    },
    invoiceUrl: {
      type: String,
      required: false,
    },
    gst: {
      type: String,
      required: false,
    },
    agreementUrl: {
      type: String,
      required: false,
    },
    agreementId: {
      type: String,
      required: false,
    },
    CouponID: {
      type: String,
      required: false,
    },
    payments: [{ type: Schema.Types.ObjectId, ref: 'razorPayPayment' }],
    deleted:{
      type:Boolean,
      default:false,
      required:true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const autoPopulateFields = function (next) {
  this.populate('billingId');
  this.populate('programSessions', 'sessionName basePricePerSession');
  this.populate('payments');
  this.populate(
    'userId',
    'mobile email name -activeSubscriptions -purchasedSessions -subscribedAdvisories'
  );
  this.populate(
    'advisoryId',
    'productTitle -hostProfileId -subscriptionPlanIds'
  );
  this.select('+advisoryName');
  this.select('+type');
  this.select('+numberOfSessions');
  next();
};

orderSchema.virtual('paymentDetails', {
  ref: 'razorPayPayment',
  localField: ['payments'],
  foreignField: ['id'],
});

orderSchema.virtual('type').get(function () {
  if (this.programSessions && this.programSessions.length > 0) {
    return 'session';
  } else if (this.advisoryId) {
    return 'advisory';
  } else {
    return 'Order Failed';
  }
});

orderSchema.pre('save', function (next) {
  const order = this;
  order.orderId = `RI/ORD/${nanoid(14)}`;
  next();
});

orderSchema.virtual('numberOfSessions').get(function () {
  return this.programSessions.length;
});

orderSchema.pre('findOne', autoPopulateFields).pre('find', autoPopulateFields);

orderSchema.virtual('courseInformation', {
  ref: 'superCourse',
  localField: ['superCourseId'],
  foreignField: ['superCourseId'],
});

orderSchema.virtual('programSession', {
  ref: 'programSession',
  localField: ['purchasedSessions'],
  foreignField: ['sessionId'],
});
module.exports = mongoose.model('order', orderSchema);
