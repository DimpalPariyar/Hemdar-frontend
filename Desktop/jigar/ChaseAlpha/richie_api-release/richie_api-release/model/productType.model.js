const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    productTypeName: {
        type: String, required: true, unique: [true, "Product Type name must be unique"],
    }, shortDescription: {
        type: String, required: false
    }, deActivate: {
        type: Boolean, default: false
    },
}, {
    versionKey: false
});

module.exports = mongoose.model('productType', productTypeSchema);