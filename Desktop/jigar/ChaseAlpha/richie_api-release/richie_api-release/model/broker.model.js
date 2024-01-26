const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

brokerSchema.pre('remove', async function () {
  await this.model('UserBrokers').deleteMany({ broker: this._id });
});

module.exports = mongoose.model('Brokers', brokerSchema);
