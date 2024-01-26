const mongoose = require("mongoose");
const { Schema } = mongoose;
const ckycSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  ckyc_number: { type: String, require: true },
  name: { type: String },
  fathers_name: { type: String },
  age: { type: Number },
  image_type: { type: String },
  photo: { type: String },
  kyc_date: { type: String },
  updated_date: { type: String },
  remarks: { type: String },
  ckyc_prefix: { type: String },
  ckycDownloadData: { type: Object },
});
ckycSchema.index({ userId: 1 });
module.exports = mongoose.model("ckyc", ckycSchema);
