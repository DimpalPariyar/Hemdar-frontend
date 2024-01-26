const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationUpdate = new mongoose.Schema(
  {
    notificationBody: { type: String },
    notificationTitle: { type: String },
    unSubNotificationTitle: { type: String },
    unSubNotificationBody: { type: String },
    subscribedUsers: [{ userId: {type: Schema.Types.ObjectId ,ref: 'Users'},
    readStatus:{type:Boolean,default:false} }],
    targetAudience:{type:String},
    userDetails:{type:Object},
    typeOfNotification:{type:Schema.Types.ObjectId,required:true,ref:'notificationsType'},
    adviceId:{type:Schema.Types.ObjectId},
    insturmentName:{type:String}
  },
  { timestamps: true }
);

module.exports = mongoose.model('notifications', notificationUpdate);
