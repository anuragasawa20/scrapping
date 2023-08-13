// productModel

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    numReviews: Number,
    ratings: Number,
    mediaCount: Number,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
