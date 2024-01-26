const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema(
  {
    messageTypeId: {
      type: Schema.Types.ObjectId,
      ref: "chatType",
      required: true,
    },
    messageType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    imageUrl: { type: String },
    productUrl: { type: String },
    videoUrl: { type: String },
    adviceId: { type: mongoose.Schema.Types.ObjectId, ref: "advice" },
    adviceType: { type: String },
    productId: [{ type: Schema.Types.ObjectId, ref: "product" }],
    productType: [{ type: String }],
  },
  { timestamps: true }
);

chatSchema.index({ messageTypeId: 1 });
chatSchema.index({ adviceId: 1 });
chatSchema.index({ productId: 1 });
// chatSchema.index({ title: "text" });
// chatSchema.index({ messageType: "text" });
// chatSchema.index({ description: "text" });
// chatSchema.index({ adviceType: "text" });
// chatSchema.index({ productType: "text" });
chatSchema.index(
  {
    messageType: "text",
    title: "text",
    description: "text",
    adviceType: "text",
    productType: "text",
  },
  { default_language: "en", language_override: "language" }
);

module.exports = mongoose.model("chat", chatSchema);
