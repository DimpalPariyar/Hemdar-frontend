const mongoose = require('mongoose');
const { Schema } = mongoose;

const newnotification= new mongoose.Schema(
  {
    title: { type: String },
    body: { type: String },
    adviceId:{type:Schema.Types.ObjectId, ref: 'advice'},
    insturmentId:{type:Schema.Types.ObjectId, ref: 'instrument'},
    notificationType: {type: Schema.Types.ObjectId, required: true, ref: 'notificationsType'},
    targetAudience:{type:String}
  },
  { timestamps: true }
);

newnotification.index({ adviceId : 1});

module.exports = mongoose.model('newnotifications', newnotification);

