import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    expiryDate: { type: Date, required: false }
});

const commerceSchema = new mongoose.Schema({
    shippingFee: { type: Number, default: 0 },
    freeShippingOver: { type: Number, default: 0 },
    coupons: [couponSchema]
}, { timestamps: true });

export default mongoose.model("Commerce", commerceSchema);
