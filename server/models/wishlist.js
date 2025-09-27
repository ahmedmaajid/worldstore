import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
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
        variationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variation",
            default: null,
        },
    },
    { timestamps: true } // automatically adds createdAt and updatedAt
);

// Prevent same item + variation being added twice
wishlistSchema.index({ userId: 1, productId: 1, variationId: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
