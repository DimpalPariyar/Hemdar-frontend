const mongoose = require('mongoose');
const {Schema} = mongoose;
const {PriceModel} = require("../model/price.model");

const superCourseSchema = new mongoose.Schema({
    superCourseType: {
        type: Number, enum: [[0, 1, 2, 3, 4], "superCourseType can be only 0, 1, 2, 3 or 4"],
    },
    title: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    longDescription: {
        type: String,
    },
    bannerImageUrl: {
        type: String
    },
    totalVideoTime: Number,
    levelId: {type: Schema.Types.ObjectId, ref: 'level'},
    languageIds: [{type: Schema.Types.ObjectId, ref: 'language'}],
    webinarTime: { // only webinar
        type: Date
    },
    videoType: {
        type: Number, enum: [[0, 1], "videoType can have 0 and 1"],  // 1 is recorded // 0 is live
        default: 1
    },
    disclaimerDescription: {
        type: String
    },
    numberOfVideos: {
        type: Number
    },
    priceIds: [PriceModel.schema],
    isFeatured: {
        type: Boolean, default: false
    },
    linkIds: [{type: Schema.Types.ObjectId, ref: 'link'}],
    parentCourseIds: [{type: Schema.Types.ObjectId, ref: 'superCourse'}],
    hostProfileId: {type: Schema.Types.ObjectId, ref: 'hostProfile'},
    testimonialIds: [{type: Schema.Types.ObjectId, ref: 'testimonial'}],
    qaIds: [{type: Schema.Types.ObjectId, ref: 'question'}],
    childCourseIds: [{type: Schema.Types.ObjectId, ref: 'superCourse'}],
    upVotedUserIds: [{type: Schema.Types.ObjectId, ref: 'Users'}],
}, {
    toObject: {virtuals: true}, toJSON: {virtuals: true}, timestamps: true, versionKey: false
});

superCourseSchema.virtual("languageDetails", {
    ref: "language", localField: ["languageIds"], foreignField: ["_id"],
});

superCourseSchema.virtual("priceDetails", {
    ref: "price", localField: ["priceIds"], foreignField: ["_id"],
});

superCourseSchema.virtual("levelDetails", {
    ref: "level", localField: "levelId", foreignField: "_id",
});

superCourseSchema.virtual("linksList", {
    ref: "link", localField: ["linkIds"], foreignField: ["_id"],
});

superCourseSchema.virtual("hostDetails", {
    ref: "hostProfile", localField: ["hostProfileIds"], foreignField: ["hostProfileId"],
});
superCourseSchema.virtual("qaDetails", {
    ref: "questionAnswer", localField: ["qaIds"], foreignField: ["_id"],
});

superCourseSchema.virtual("childCourses", {
    ref: "superCourse", localField: ["childCourseIds"], foreignField: ["_id"],
});

module.exports = mongoose.model('superCourse', superCourseSchema);
