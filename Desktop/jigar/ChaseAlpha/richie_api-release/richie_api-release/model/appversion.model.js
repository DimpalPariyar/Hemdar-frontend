const mongoose = require("mongoose");

const appversionSchema = new mongoose.Schema(
  {
    appversion: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appversion", appversionSchema);
