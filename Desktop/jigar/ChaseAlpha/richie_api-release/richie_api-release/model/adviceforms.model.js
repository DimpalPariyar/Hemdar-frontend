const mongoose = require('mongoose');
const {Schema} = mongoose;

const adviceFormSchema = new mongoose.Schema({
    formName:{type:String,required:true},
    productId:{type:Schema.Types.ObjectId,ref:'product'},
    action:{type:String,required:true},
    lowRate:{type:Number,required:true},
    highRate:{type:Number},
    StopLoss:{type:Number},
    target1:{type:Number},
    target2:{type:Number},
    target3:{type:Number},
    TypeOfNotification:{type:Schema.Types.ObjectId , ref:'notificationsType'},
    HoldingPeriod:{type:String},
    hotkeys:{type:String},
    nameOfUnderlying:{type:String},
    nameOfUnderlyingDataId:{type:Schema.Types.ObjectId}
}, {
    timestamps: true,
});

module.exports = mongoose.model('prefilledform', adviceFormSchema);