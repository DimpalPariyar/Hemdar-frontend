const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    panNumber: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    mobile: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
    },
    // 0 - Deactivate
    // 1 - Active
    status: {
      required: true,
      type: Number,
      default: 1,
    },
    roles: {
      type: String,
    },
    permission: {
      type: Schema.Types.Mixed,
    },
    password: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    type: {
      required: true,
      type: [Number],
      default: [0],
    },
    score: {
      required: false,
      type: Number,
    },
    // 0 -> Indian
    // 1 -> NRI
    residential: {
      type: Number,
    },
    // 0 -> Female
    // 1 -> Male
    gender: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    canWhatsapp: {
      required: false,
      type: Boolean,
    },
    deleted: {
      required: true,
      type: Boolean,
      default: false,
    },
    lastLogin: {
      required: false,
      type: Date,
    },
    currentLogin: {
      required: false,
      type: Date,
    },
    purchasedCourses: {
      // courses/ webinar/megacourses
      type: [Schema.Types.ObjectId],
      default: [],
    },
    purchasedSessions: {
      // sessionIds
      type: [Schema.Types.ObjectId],
      ref: "programSession",
      default: [],
    },
    subscribedAdvisories: {
      // productIds
      type: [Schema.Types.ObjectId],
      ref: "product",
      default: [],
    },
    activeSubscriptions: {
      type: [Schema.Types.ObjectId],
      ref: "subscription",
      default: [],
    },
    riskTest: {
      type: [Schema.Types.ObjectId],
      ref: "risktest",
      default: [],
    },
    profilePicture: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    availableSessionTokens: {
      type: Number,
      default: 0,
    },
    multiBroker: {
      type: Boolean,
      default: false,
      required: true,
    },
    redirectionBroker: {
      type: Number,
      default: 0,
      required: true,
    },
    viewAccess: {
      type: Schema.Types.Mixed,
      default: [],
    },
    createAccess: {
      type: Schema.Types.Mixed,
      default: [],
    },
    updateAccess: {
      type: Schema.Types.Mixed,
      default: [],
    },
    generalNotification: {
      whatsappNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
    },
    appVersion: {
      type: String,
    },
    customNotification: [
      {
        typeOfNotification: { type: String, default: "" },
        notificationTypeid: {
          type: Schema.Types.ObjectId,
          ref: "notificationsType",
        },
        status: { type: Boolean, default: true },
      },
    ],
    whatsappnumber : {
      type: String,
      index: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

userSchema.virtual('advisory', {
  ref: 'product',
  localField: ['subscribedAdvisories'],
  foreignField: ['id'],
});

userSchema.virtual('subscriptionOrderDetails', {
  ref: 'subscriptionOrder',
  localField: ['activeSubscriptions'],
  foreignField: ['id'],
});

userSchema.virtual('programSession', {
  ref: 'programSession',
  localField: ['purchasedSessions'],
  foreignField: ['sessionId'],
});

const autoPopulateFields = function (next) {
  this.populate('purchasedSessions');
  this.populate('subscribedAdvisories');
  this.populate('activeSubscriptions');
  this.populate('riskTest');
  this.populate('customNotification');
  next();
};

userSchema.pre('findOne', autoPopulateFields).pre('find', autoPopulateFields);

module.exports = mongoose.model('Users', userSchema);
