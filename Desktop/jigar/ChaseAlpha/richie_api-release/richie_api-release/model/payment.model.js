const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  razorPayOrderId: {
    type: String,
    unique: true,
    required: true,
  },
  razorPayPaymentId: {
    type: String,
    required: true,
  },
  razorPaySignature: {
    type: String,
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  subscriptionOrderId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  superCourseId: [Schema.Types.ObjectId],
  programId: {
    type: Schema.Types.ObjectId,
  },
  programSessions: {
    //name of program
    type: [Schema.Types.ObjectId],
  },
});

paymentSchema.virtual('orderInformation', {
  ref: 'order',
  localField: ['orderId'],
  foreignField: ['_id'],
});

paymentSchema.virtual('userInformation', {
  ref: 'Users',
  localField: ['userId'],
  foreignField: ['id'],
});

paymentSchema.virtual('courseInformation', {
  ref: 'superCourse',
  localField: ['superCourseId'],
  foreignField: ['superCourseId'],
});

module.exports = mongoose.model('payments', paymentSchema);
