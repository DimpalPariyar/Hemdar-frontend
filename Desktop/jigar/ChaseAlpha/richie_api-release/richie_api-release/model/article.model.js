const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    articleTitle: {
        type: String,
        required: true,
    },
    articleBlogHTML: { //will make it separate schema with ref in future
        type: String,
        required: true,
    }
}, {versionKey: false, timestamps: true}); // createdAt & updatedAt item will be generated/updated during insertion or update

module.exports = mongoose.model('article', articleSchema);
