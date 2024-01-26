const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    otp: {
      type: Number,
      required: true,
      trim: true,
    },
    // 0 -> Pending
    // 1 -> Verified
    status: {
      type: Number,
      required: true,
      trim: true,
    },
    expireIn: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ mobile: 1 });
otpSchema.index({ email: 1 });

module.exports = mongoose.model("OTPs", otpSchema);
