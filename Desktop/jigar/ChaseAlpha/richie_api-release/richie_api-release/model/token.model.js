const mongoose = require('mongoose');

const refreshToken = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    token: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    // 0 -> loggedIn
    // 1 -> loggedOut
    status: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('refreshTokens', refreshToken);
