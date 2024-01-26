const mongoose = require('mongoose');
const {Schema} = require("mongoose");

const topicSchema = new mongoose.Schema({
    topicTitle: {
        type: String,
        required: true,
    },
    topicDescription: {
        type: String,
        required: true,
    },
    topicDisabled: {
        type: Boolean,
        default: false
    },
    topicIconUrl: {
        type: String
    },
    articles:[{type: Schema.Types.ObjectId, ref: 'article'}],
}, {versionKey: false});

const autoPopulateFields = function (next) {
    this.populate('articles');
    next();
}

topicSchema.virtual("articleDetails", {
    ref: "instrument", localField: ["articles"], foreignField: ["_id"],
});

topicSchema.pre('findOne', autoPopulateFields).pre('find', autoPopulateFields);

module.exports = mongoose.model('topic', topicSchema);
