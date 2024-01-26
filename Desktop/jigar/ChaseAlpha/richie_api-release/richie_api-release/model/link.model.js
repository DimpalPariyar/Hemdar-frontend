const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    sortOrder: {
        type: String,
    },
    videoNumber: {
        type: Number
    },
    linkUrl: {
        type: String,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    timeDuration: {  // seconds
        type: Number,
    },
})

module.exports = mongoose.model('link', linkSchema);
