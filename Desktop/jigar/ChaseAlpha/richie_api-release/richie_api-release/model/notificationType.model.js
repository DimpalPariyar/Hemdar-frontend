const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationType = new mongoose.Schema(
  {
    typeofNotification: { type: String,required:true },
    notificationDescription: { type: String,required:true},
    notificationLimit: { type: String }
  }
);

module.exports = mongoose.model('notificationsType', notificationType);
