const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    }
}, {
    _id: false
});

const testimonialSchema = new mongoose.Schema({
    testimonialLabel: {
        type: String,
    },
    feedback: {
        type: String,
        required: true,
    },
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'Users'},
    reviewUser: reviewUserSchema
}, {
    versionKey: false
});

module.exports = mongoose.model('testimonial', testimonialSchema);
