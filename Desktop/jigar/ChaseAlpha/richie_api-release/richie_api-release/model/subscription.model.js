const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
const { Schema } = mongoose;

const subscriptionSchema = new mongoose.Schema(
  {
    advisoryId: {
      type: Schema.Types.ObjectId,
      ref: 'product',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'price',
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: false,
    },
    renewCount: {
      type: Number,
      default: 0,
    },
    deleted:{type:Boolean,default:false}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    
  }
);

module.exports = mongoose.model('subscription', subscriptionSchema);
