import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        productImage: {
            type: String,
            required: true,
            trim: true,
        },
        variationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variation",
            default: null,
        },
        variationName: {
            type: String,
            trim: true,
            default: null,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("CartItem", cartItemSchema);
