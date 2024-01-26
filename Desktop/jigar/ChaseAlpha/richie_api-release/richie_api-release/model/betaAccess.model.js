const mongoose = require('mongoose');

const betaAccessSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    mobile: {
      type: String,
    },
    device: {
      type: String,
    },
    srNo: {
      type: Number,
      required: true,
    },
    registeredAt: {
      type: String,
    },
    interests: [
      {
        type: String,
      },
    ],
    tradingCapital: {
      type: String,
    },
    brokerAccounts: [{ type: String }],
    enable: {
      type: Boolean,
      required: true,
      default: false,
    },
    row: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('betaAccess', betaAccessSchema);
