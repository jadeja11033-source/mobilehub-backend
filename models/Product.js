const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: 'Mobile Accessories' },
    description: { type: String },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);