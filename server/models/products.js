import mongoose from "mongoose";
import slugify from "slugify";

const VariationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    value: { type: String, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: null },
    image: { type: String, default: null },
    inStock: { type: Boolean, default: true },
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    superSubCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    images: {
        main: { type: String, required: true },
        sub: [{ type: String }]
    },
    stock: { type: Boolean, default: true },
    variations: [VariationSchema],
    createdAt: { type: Date, default: Date.now },
});

ProductSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

export const Product = mongoose.model("Product", ProductSchema);
