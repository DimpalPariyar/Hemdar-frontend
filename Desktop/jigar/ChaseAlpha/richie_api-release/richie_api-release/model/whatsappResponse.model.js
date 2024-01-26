const mongoose = require('mongoose')
const whatsappresponse = mongoose.Schema({
    messagebody:{type:String,required:true},
    responses:{type:Array}
}, {
    timestamps: true,
  })
module.exports = mongoose.model('whatsappresponse', whatsappresponse);