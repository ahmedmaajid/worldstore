import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, unique: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },

        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                variationId: { type: String },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                totalPrice: { type: Number, required: true },
                image: { type: String },
                attributes: { type: Map, of: String },
                // size: { type: String },
                // color: { type: String },
            },
        ],

        shippingFee: {
            type: Number,
            default: 0,
        },
        freeShippingOver: {
            type: Number,
            default: null,
        },

        coupon: {
            code: { type: String },
            discountType: { type: String, enum: ["fixed", "percentage"] },
            discountValue: { type: Number },
            description: { type: String },
        },

        subtotal: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },

        shippingAddress: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String },
            postalCode: { type: String },
            country: { type: String, default: "Sri Lanka" },
        },

        status: {
            type: String,
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

orderSchema.pre("save", function (next) {
    if (!this.orderNumber) {
        this.orderNumber = "WS-" + Date.now().toString().slice(-6);
    }
    next();
});
export default mongoose.model("Order", orderSchema);
