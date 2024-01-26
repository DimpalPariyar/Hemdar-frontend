const mongoose = require("mongoose");
const { Schema } = mongoose;

const userNotification = new mongoose.Schema(
  {
    notificationid: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "newnotifications",
    },
    readStatus: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true },
);
userNotification.index({ userId: 1 });
userNotification.index({ readStatus: -1 });
module.exports = mongoose.model("usernotifications", userNotification);

