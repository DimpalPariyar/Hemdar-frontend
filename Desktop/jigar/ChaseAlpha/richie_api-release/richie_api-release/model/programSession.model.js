const mongoose = require('mongoose');
const { Schema } = mongoose;

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const programSessionSchema = new mongoose.Schema(
  {
    shortDescription: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    sessionName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    sessionLink: {
      type: String,
      required: false,
    },
    webinarId: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    basePricePerSession: {
      type: Number,
      default: null,
    },
    hostIds: {
      type: [Schema.Types.ObjectId],
    },
    bannerImage: {
      type: String,
      required: false,
    },
    deActivated: {
      type: Boolean,
      default: false,
    },
    closeSessionAfter: {
      type: Number,
      default: 30,
    },
    disclaimer: {
      type: String,
      required: false,
    },
    canAskQuestion: {
      type: Boolean,
      default: false,
    },
    faqs: [faqSchema],
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    versionKey: false,
  }
);

programSessionSchema.virtual('hostDetails', {
  ref: 'hostProfile',
  localField: ['hostIds'],
  foreignField: ['hostProfileId'],
});

module.exports = mongoose.model('programSession', programSessionSchema);
