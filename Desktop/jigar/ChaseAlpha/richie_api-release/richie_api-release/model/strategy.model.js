const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  expiry: {
    type: String,
  },
  strike: {
    type: String,
  },
  optionType: {
    type: String,
  },
  action: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  ltp: {
    type: Number,
  },
  minQty: {
    type: Number,
    default: 1,
  },
  trueDataSymbol: { type: String },
  kiteSymbol: { type: String },
  angelOneSymbol: { type: String },
});
strategySchema.index({trueDataSymbol:1})
module.exports = mongoose.model('strategy', strategySchema);
