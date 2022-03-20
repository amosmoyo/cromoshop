const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {type: String, required: true},
    rating: {type: Number, required: true},
    comment: {type: String, required: true},
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

const productSchema = new mongoose.Schema({
    name: {
        required: [true, 'name is required'],
        type: String
    },
    description: {
        required: [true, 'name is required'],
        type: String
    },
    brand: {
        required: [true, 'brad required'],
        type: String
    },
    category: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'price is required'],
        default:0
    },
    reviews: {
        type: [reviewSchema],
        default: []
    },
    countInStock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    image:{
        type: String,
        required: true
    }, 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);