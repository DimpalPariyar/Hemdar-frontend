const mongoose = require('mongoose');
const { Schema } = mongoose;
const productviseUser = new mongoose.Schema({
    productId: {type: Schema.Types.ObjectId, ref: 'product',require:true},
    listofuserId:{type:Array}
});
productviseUser.index({productId:1})

module.exports = mongoose.model('productviseUser', productviseUser);