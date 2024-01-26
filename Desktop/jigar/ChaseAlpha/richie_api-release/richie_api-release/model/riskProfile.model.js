const mongoose = require('mongoose');

const scoreOption = new mongoose.Schema({
    scoreOptionId: {
        type: String,
        required: true,
        default: () => mongoose.Types.ObjectId()
    },
    optionName: {
        type: String,
        required: true,
    },
    optionValueMin: {
        type: Number,
        require: true
    },
    optionValueMax: {
        type: Number,
        require: true
    }
}, {_id: false});

const option = new mongoose.Schema({
    optionId: {
        type: String,
        required: true,
        default: () => mongoose.Types.ObjectId()
    },
    optionName: {
        type: String,
        required: true,
    },
    optionValue: {
        type: Number,
        require: true
    }
}, {_id: false});

const scoreCardSchema = new mongoose.Schema({
    scoreCardTitle: {
        type: String,
        required: true,
    },
    options: [scoreOption]
}, {_id: false});

const questionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true,
        default: () => mongoose.Types.ObjectId()
    },
    questionDisabled: {
        type: Boolean,
        default: false
    },
    questionDescription: {
        type: String,
        required: true,
    },
    options: [option]
}, {_id: false});

const RiskProfileSchema = new mongoose.Schema({
    scoreCard: scoreCardSchema,
    questions: [questionSchema],
});

module.exports = mongoose.model('riskProfile', RiskProfileSchema);
