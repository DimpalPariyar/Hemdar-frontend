const mongoose = require('mongoose');

const adminlistnotification= new mongoose.Schema(
  {
    title: { type: String },
    body: { type: String },
    notificationType: {type: String},
    targetAudience:{type:String},
    userDetails:{type:Object}
  },
  { timestamps: true }
);

adminlistnotification.index({userDetails:1})
module.exports = mongoose.model('adminlistnotifications', adminlistnotification);

