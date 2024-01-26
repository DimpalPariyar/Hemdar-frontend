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

const adminadviceSchema = new mongoose.Schema(
    {
      change: { type: Number },
      date: { type: String },
      stopLoss: { type: Number },
      action: { type: String },
      target1: { type: Number },
      target2: { type: Number },
      target3: { type: Number },
      lotSize: { type: Number },
      perLotProfit: { type: Number },
      returnPercentage: { type: Number },
      analyst: { type: String },
      product: { type: String },
      productType:{type: String},
      productId:{type: String},
      entry: { type: String },
      instrument: { type: String },
      nameOfUnderlying: { type: String },
      status: { type: String },
      timeFrame: { type: String },
      trueDataSymbol: { type: String },
      cmp: { type: Number },
      updates: {
        type: [adviceUpdate],
        default: [],
      },
      optionStrike:{ type: Number },
      optionType:{ type: String },
      expiry:{type:String}
    }
  );
 adminadviceSchema.index({status:1})
 adminadviceSchema.index({product:1})
  module.exports = mongoose.model('adminadvice', adminadviceSchema);
