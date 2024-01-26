const mongoose = require('mongoose');

const panSchema = new mongoose.Schema({
    name: {
        type: String
    },
    panNumber: {
        required: true,
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
});

module.exports = mongoose.model('PanCard', panSchema)