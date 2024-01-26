const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
  {
    gstNo: {
      type: String,
    },
    name: {
      type: String,
    },
    company: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    mobile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('billing', billingSchema);
