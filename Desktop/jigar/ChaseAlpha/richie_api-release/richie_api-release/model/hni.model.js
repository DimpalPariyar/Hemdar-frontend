const mongoose = require('mongoose')
const {Schema}=mongoose;

const hniFormSchema = new mongoose.Schema({
    name:{type:String , required:true},
    riskscore:{type:Number},
    mobile: {
        type: String,
        trim: true,
        index: true,
        unique: true,
        sparse: true,
      }},
      { timestamps: true }
      )

module.exports = mongoose.model('hni',hniFormSchema)