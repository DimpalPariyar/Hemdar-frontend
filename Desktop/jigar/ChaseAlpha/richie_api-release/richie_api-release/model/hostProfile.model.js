const mongoose = require('mongoose');

const hostProfileSchema = new mongoose.Schema({
    hostName: {
        type: String,
        minLength: [4, 'Host name is too short'],
        required: true,
        default: "SirName"
    },
    profileImage: {
        type: String,
        required: [false, "Profile image is required"],
    },
    role: {
        type: String,
        required: [true, "role is required"],
    },
    shortDescription: {
        type: String,
        required: [true, "shortDescription is required"],
        default: "Lorem ispum kajbslja"
    },
    licenseNumber: {
        type: String,
        required: [true, "licenceNumber is required"]
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "email is required"]
    },
    address: {
        type: String
    },
    registerNumber: {
        type: String,
        required: [true, "registerNumber is required"]
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: [10, "Phone number must be 10 digits"]
    },
    type: {
        type: [Number],
        enum: [[0, 1], "Type can have 0 and 1"],
        required: true,
        unique: true,
        validate: [
            {validator: arrayLimit, message: "Length of type array can be <= 2"},
            {validator: hasDuplicates, message: "Type do not accept duplicates"}]
    }
}, {versionKey: false});

function arrayLimit(array) {
    return array.length > 0 && array.length <= 2;
}

function hasDuplicates(array) {
    return (new Set(array)).size === array.length;
}

module.exports = mongoose.model('hostProfile', hostProfileSchema);
