const mongoose = require('mongoose');
const {Schema} = mongoose;

const offerSchema = new mongoose.Schema({
    offerId: Schema.Types.ObjectId,
    superCourseIds: [String],
    // superCourseTypes:[String],
    bannerImage: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

offerSchema.virtual("courseList", {
    ref: "superCourse",
    localField: ["superCourseIds"],
    foreignField: ["superCourseId"],
});

module.exports = mongoose.model('offer', offerSchema);
