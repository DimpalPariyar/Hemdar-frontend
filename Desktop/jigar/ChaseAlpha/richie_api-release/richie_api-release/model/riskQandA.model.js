const mongoose = require('mongoose');

const RiskQandA = new mongoose.Schema({
    userId:{ 
    type:String,
    required:true
    },
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    response:[],
    scores:[],
    totalScores:{
        type:Number,
        required:true
    },
},
{  
     timestamps: true,
  })

module.exports = mongoose.model('risktest',RiskQandA)