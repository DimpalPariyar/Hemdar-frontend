const mongoose = require('mongoose');
const { getHoursLater } = require('../utils/DateTimeUtils');

const userBrokerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    broker: {
      type: mongoose.Types.ObjectId,
      ref: 'Brokers',
      required: true,
    },
    clientId: {
      type: String,
      trim: true,
      required: true,
    },
    apiKey: {
      type: String,
      trim: true,
      required: true,
    },
    apiSecret: {
      type: String,
      trim: true,
      required: true,
    },
    accessToken: {
      type: String,
      trim: true,
    },
    accessTokenExpiry: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userBrokerSchema.pre('save', async function () {
  if (this.active && this.isModified('active')) {
    await this.model('UserBrokers').updateMany({
      active: false,
    });
  }

  if (this.accessToken && this.isModified('accessToken')) {
    this.accessTokenExpiry = getHoursLater(24);
  }
});

module.exports = mongoose.model('UserBrokers', userBrokerSchema);
