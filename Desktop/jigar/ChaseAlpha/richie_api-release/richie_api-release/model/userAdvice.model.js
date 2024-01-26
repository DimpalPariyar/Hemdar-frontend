const mongoose = require('mongoose');
const { Schema } = mongoose;
    
const adviceUpdate = new mongoose.Schema(
  {
    remarks: { type: String },
    price: { type: Number },
    newStatus: { type: String },
    notificationBody: { type: String },
    notificationTitle: { type: String },
    unSubNotificationBody: { type: String },
    unSubNotificationTitle: { type: String },
    typeOfNotification:{type: Schema.Types.ObjectId}
  },
  { timestamps: true }
);
const useradviceSchema = new mongoose.Schema(
    {
      createdAt: { type: Date },
      updatedAt: { type: Date },
      remarks: { type: String },
      riskReward: { type: String },
      holdingPeriod: { type: String },
      stopLoss: { type: Number },
      action: { type: String },
      target1: { type: Number },
      target2: { type: Number },
      target3: { type: Number },
      lotSize: { type: Number },
      maxLoss: { type: Number },
      maxProfit: { type: Number },
      productType:{type: String},
      product: { type: String },
      entryLowerRange: { type: Number },
      entryUpperRange: { type: Number },
      instrumentName: { type: String },
      nameOfUnderlying: { type: String },
      status: { type: String },
      updates: {
        type: [adviceUpdate],
        default: [],
      },
      strategy:{type:Array}
    }
  );
  useradviceSchema.index({status:1})
  useradviceSchema.index({createdAt:1})
  module.exports = mongoose.model('useradvice', useradviceSchema);
