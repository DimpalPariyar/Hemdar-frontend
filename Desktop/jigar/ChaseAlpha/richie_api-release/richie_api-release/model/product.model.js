const mongoose = require('mongoose');
const {Schema} = mongoose;

const productModelSchema = new mongoose.Schema({
    productTitle: {
        required: true, type: String, unique: true
    },
    productShortDescription: {
        type: String
    },
    productLongDescription: {
        type: String
    },
    minInvestValue: {
        type: Number,
    },
    numberOfTradePerWeek: {
        type: String,
    },
    bannerImage: {
        type: String,
    },
    Active: {
        type: Boolean,
    },
    hostProfileId: {type: Schema.Types.ObjectId, ref: 'hostProfile'},
    subscriptionPlanIds: [{type: Schema.Types.ObjectId, ref: 'price'}],
    relatedProductsIds: [{type: Schema.Types.ObjectId, ref: 'product'}],
    marketId: {type: Schema.Types.ObjectId, ref: 'market'},
    exchangeId: {type: Schema.Types.ObjectId, ref: 'exchange'},
    productTypeId: {type: Schema.Types.ObjectId, ref: 'productType'},
    timeFrameId: {type: Schema.Types.ObjectId, ref: 'timeFrame'},
    volatilityId: {type: Schema.Types.ObjectId, ref: 'volatility'},
    instrumentId: {type: Schema.Types.ObjectId, ref: 'instrument'},
}, {
    versionKey: false
});

const autoPopulateFields = function (next) {
    this.populate('marketId');
    this.populate('exchangeId');
    this.populate('productTypeId');
    this.populate('timeFrameId');
    this.populate('hostProfileId');
    this.populate('volatilityId');
    this.populate('instrumentId');
    this.populate('subscriptionPlanIds');
    next();
};

productModelSchema.virtual("instrumentDetails", {
    ref: "instrument", localField: ["instrumentId"], foreignField: ["id"],
});

productModelSchema.virtual("marketDetails", {
    ref: "market", localField: ["marketId"], foreignField: ["id"],
});

productModelSchema.virtual("exchangeDetails", {
    ref: "exchange", localField: ["exchangeId"], foreignField: ["id"],
});

productModelSchema.virtual("productTypeDetails", {
    ref: "productType", localField: ["productTypeId"], foreignField: ["id"],
});

productModelSchema.virtual("timeFrameDetails", {
    ref: "timeFrame", localField: ["timeFrameIds"], foreignField: ["id"],
});

productModelSchema.virtual("volatilityDetails", {
    ref: "volatility", localField: ["volatilityIds"], foreignField: ["id"],
});

productModelSchema.virtual("hostDetails", {
    ref: "hostProfile", localField: ["hostProfileIds"], foreignField: ["hostProfileId"],
});

productModelSchema.virtual("subscriptionPlanId", {
    ref: "price", localField: ["subscriptionPlanIds"], foreignField: ["id"],
});

productModelSchema.virtual("relatedProducts", {
    ref: "product", localField: ["relatedProductsIds"], foreignField: ["productId"],
});

productModelSchema.pre('findOne', autoPopulateFields).pre('find', autoPopulateFields);

module.exports = mongoose.model('product', productModelSchema);