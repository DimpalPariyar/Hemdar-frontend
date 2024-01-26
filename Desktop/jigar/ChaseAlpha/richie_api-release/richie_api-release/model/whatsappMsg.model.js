const mongoose = require('mongoose')
const { Schema } = mongoose;
const whatsappMsg = mongoose.Schema({
    messagebody:{type:String,required:true},
    templateId:{type:String},
    templateName:{type:String},
    adviceid:{type:Schema.Types.ObjectId,ref:'advice'},
    usermobile:{type:String},
    userId:{type:Schema.Types.ObjectId,ref:'Users'},
    responses:{type:Array}
}, {
    timestamps: true,
  })
whatsappMsg.index({userId:1})
whatsappMsg.index({usermobile:1})
whatsappMsg.index({adviceid:1})
whatsappMsg.index({templateName:1})
module.exports = mongoose.model('whatsappmsg', whatsappMsg);