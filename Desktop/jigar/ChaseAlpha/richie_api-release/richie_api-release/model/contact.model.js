const mongoose = require('mongoose');
const {Schema} = mongoose;

const contactUsSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'Users', required: true,
    }, mobile: {
        type: String, required: true,
        unique: true,
        minlength: [10, "Phone number must be 10 digits"]
    }, name: {
        type: String, required: true
    }, isContacted : {
        type: Boolean, default : false
    }, isVerified :{
        type: Boolean, default : false
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('contact', contactUsSchema);