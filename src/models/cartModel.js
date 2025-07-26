
import mongoose, { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'customers', 
        required: true 
    },
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'menus', 
        required: true 
    },
    itemName: { type: String, required: true },
    categoryName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    description: { type: String, default: '' },
}, {
    timestamps: true
});

// Compound index to ensure one cart item per user per menu item
cartSchema.index({ userId: 1, itemId: 1 }, { unique: true });

const cartModel = model('carts', cartSchema);
export default cartModel;
