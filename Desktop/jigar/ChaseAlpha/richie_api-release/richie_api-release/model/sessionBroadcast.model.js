const mongoose = require('mongoose');
const {emitDataToSocket} = require("../service/socket_io_service");
const { Schema } = mongoose;

const reactionSchema = new mongoose.Schema({
    emoji: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const sessionBroadcastSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'programSession'
    },
    reactions: [reactionSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

sessionBroadcastSchema.post('save', function (doc) {
    emitDataToSocket("SESSION_BROADCAST",doc)
});

module.exports = mongoose.model('sessionBroadcast', sessionBroadcastSchema);