const mongoose = require('mongoose');
const { emitDataToSocket } = require('../service/socket_io_service');
const { Schema } = mongoose;

const sessionQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'programSession',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    answer: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

sessionQuestionSchema.pre('find', function (next) {
  this.userId && this.populate('userId', 'name');
  next();
});

sessionQuestionSchema.pre('findOne', function (next) {
  this.userId && this.populate('userId', 'name');
  next();
});

sessionQuestionSchema.post('find', function (docs) {
  docs.map((doc) => {
    if (this.userId) {
      doc.name = doc.userId.name;
      doc.userId = doc.userId._id;
    }
    return doc;
  });
});

sessionQuestionSchema.post('findOne', function (doc) {
  if (doc && doc.userId) {
    doc.name = doc.userId.name;
    doc.userId = doc.userId._id;
  }
});

sessionQuestionSchema.post('save', function (doc) {
  emitDataToSocket('SESSION_QUESTION', doc);
});

module.exports = mongoose.model('sessionQuestion', sessionQuestionSchema);
