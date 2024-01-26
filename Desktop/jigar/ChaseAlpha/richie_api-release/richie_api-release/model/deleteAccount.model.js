const mongoose = require('mongoose');

const deleteAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('deleteAccount', deleteAccountSchema);
