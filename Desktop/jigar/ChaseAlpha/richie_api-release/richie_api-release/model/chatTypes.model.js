const mongoose = require("mongoose");

const chatTypeSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chatType", chatTypeSchema);
