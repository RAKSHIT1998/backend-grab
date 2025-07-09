
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const ratingSchema = new Schema({
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'menus', 
        required: true 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers', // assuming your user model is named 'users'
        required: true
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 
    },
}, {
    timestamps: true
});
ratingSchema.index({ itemId: 1, userId: 1 });

const ratingModel = model('ratings', ratingSchema);
module.exports = ratingModel;
