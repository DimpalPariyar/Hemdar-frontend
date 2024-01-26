const mongoose = require("mongoose");
const { emitDataToSocket } = require("../service/socket_io_service");
const { notifyProduct } = require("../controller/notification.controller");
const { NotifyProduct } = require("../controller/newnotification.controller");
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
    typeOfNotification: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

const adviceSchema = new mongoose.Schema(
  {
    advisoryId: { type: Schema.Types.ObjectId, ref: "product" },
    hostProfileId: { type: Schema.Types.ObjectId, ref: "hostProfile" },
    marketId: { type: Schema.Types.ObjectId, ref: "market" },
    exchangeId: { type: Schema.Types.ObjectId, ref: "exchange" },
    productTypeId: { type: Schema.Types.ObjectId, ref: "productType" },
    timeFrameId: { type: Schema.Types.ObjectId, ref: "timeFrame" },
    instrumentId: { type: Schema.Types.ObjectId, ref: "instrument" },
    nameOfUnderlying: { type: String },
    strategy: [{ type: Schema.Types.ObjectId, ref: "strategy" }],
    entryLowerRange: { type: Number },
    entryUpperRange: { type: Number },
    stopLoss: { type: Number },
    stopLossType: { type: String },
    target1: { type: Number },
    target2: { type: Number },
    target3: { type: Number },
    probabilityProfit: { type: Number },
    maxProfit: { type: Number },
    maxLoss: { type: Number },
    expiryLowerBreakEven: { type: String },
    expiryUpperBreakEven: { type: String },
    weightage: { type: Number },
    remarks: { type: String },
    attachment: { type: String },
    status: { type: String },
    updateType: { type: String },
    internalRational: { type: String },
    internalChart: { type: String },
    analyst: { type: String },
    riskReward: { type: String },
    holdingPeriod: { type: String },
    notificationBody: { type: String },
    notificationTitle: { type: String },
    unSubNotificationBody: { type: String },
    unSubNotificationTitle: { type: String },
    typeOfNotification: { type: Schema.Types.ObjectId },
    action: {
      type: String,
    },
    updates: {
      type: [adviceUpdate],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const autoPopulateFields = function (next) {
  this.populate("advisoryId");
  this.populate("strategy");
  this.populate("instrumentId");
  this.populate("marketId");
  this.populate("exchangeId");
  this.populate("productTypeId");
  this.populate("timeFrameId");
  this.populate("hostProfileId");
  next();
};

adviceSchema.virtual("advisoryDetails", {
  ref: "product",
  localField: ["advisoryId"],
  foreignField: ["id"],
});

adviceSchema.virtual("strategyDetails", {
  ref: "strategy",
  localField: ["strategy"],
  foreignField: ["id"],
});

adviceSchema.virtual("instrumentDetails", {
  ref: "instrument",
  localField: ["instrumentId"],
  foreignField: ["id"],
});

adviceSchema.virtual("marketDetails", {
  ref: "market",
  localField: ["marketId"],
  foreignField: ["id"],
});

adviceSchema.virtual("exchangeDetails", {
  ref: "exchange",
  localField: ["exchangeId"],
  foreignField: ["id"],
});

adviceSchema.virtual("productTypeDetails", {
  ref: "productType",
  localField: ["productTypeId"],
  foreignField: ["id"],
});

adviceSchema.virtual("timeFrameDetails", {
  ref: "timeFrame",
  localField: ["timeFrameId"],
  foreignField: ["id"],
});

adviceSchema.virtual("hostDetails", {
  ref: "hostProfile",
  localField: ["hostProfileId"],
  foreignField: ["hostProfileId"],
});

adviceSchema.pre("findOne", autoPopulateFields).pre("find", autoPopulateFields);

adviceSchema.pre("save", function (next) {
  const trade = this;
  let risk = 0;
  let reward = 0;

  const target = trade.target3 ?? trade.target2 ?? trade.target1;
  if (trade.action === "buy") {
    risk = trade.entryLowerRange - trade.stopLoss;
    reward = target - trade.entryLowerRange;
  } else if (trade.action === "sell") {
    risk = trade.stopLoss - trade.entryUpperRange;
    reward = trade.entryUpperRange - target;
  }

  trade.riskReward = `1:${(reward / risk).toFixed(1)}`;
  trade.maxProfit = reward.toFixed(2);
  trade.maxLoss = risk.toFixed(2);
  next();
});

function populateAndEmit(doc) {
  doc.populate(
    [
      { path: "advisoryId" },
      { path: "strategy" },
      { path: "instrumentId" },
      { path: "marketId" },
      { path: "exchangeId" },
      { path: "productTypeId" },
      { path: "timeFrameId" },
      { path: "hostProfileId" },
    ],
    async function (err, populatedDoc) {
      if (err) {
        console.error(err);
      }
      emitDataToSocket("NOTIFY", populatedDoc);

      // const comboProduct = await doc
      //   .model('product')
      //   .find({
      //     relatedProductsIds: doc.advisoryId._id,
      //   })
      //   .select('_id')
      //   .lean();

      const productIds = [doc.advisoryId._id.toString()];
      const targetAudience = doc.advisoryId.productTitle;
      // if (comboProduct.length) {
      //   comboProduct.forEach((product) => productIds.push(product._id));
      // }
      const insturmentName = doc.instrumentId?.name;
      const insturmentId = doc.instrumentId?._id;
      // notifyProduct(
      //   productIds,
      //   doc.notificationTitle,
      //   doc.notificationBody,
      //   doc.unSubNotificationTitle,
      //   doc.unSubNotificationBody,
      //   doc._id,
      //   targetAudience,
      //   doc.typeOfNotification,
      //   insturmentName,
      //   undefined,
      //   doc.internalChart
      // )
      const whatsapp = {
        action: doc.action.toUpperCase(),
        underlying:`${doc.nameOfUnderlying} ${doc.strategy[0]?.expiry === null ? "" :`${doc.strategy[0]?.expiry.split('-')[0]}-${doc.strategy[0]?.expiry.split('-')[1]}`} ${doc.strategy[0]?.strike === null ? "" : doc.strategy[0]?.strike} ${doc.strategy[0]?.optionType === null? "": doc.strategy[0]?.optionType}`,
        entry: `${doc.entryLowerRange} - ${doc.entryUpperRange}`,
        stoploss: doc.stopLoss,
        target: `${doc?.target1?doc?.target1:''},${doc?.target2?doc?.target2:''},${doc?.target3?doc?.target3:''}`,
        instrument:insturmentName
      };
      NotifyProduct(
        productIds,
        doc.notificationTitle,
        doc.notificationBody,
        doc.unSubNotificationTitle,
        doc.unSubNotificationBody,
        doc._id,
        targetAudience,
        doc.typeOfNotification,
        insturmentId,
        undefined,
        doc.internalChart,
        whatsapp
      );
  
    }
  );
}

adviceSchema.post("save", function (doc) {
  populateAndEmit(doc);
});

module.exports = mongoose.model("advice", adviceSchema);
