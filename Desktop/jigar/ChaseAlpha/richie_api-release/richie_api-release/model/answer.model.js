const mongoose = require('mongoose');
const {Schema} = mongoose;

const answerSchema = new mongoose.Schema({
    hostProfileId: {
        type: Schema.Types.ObjectId,
        ref: 'hostProfile',
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('answer', answerSchema);
