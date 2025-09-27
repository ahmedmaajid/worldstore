import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const variationSchema = new Schema(
    {
        price: {
            type: Number,
            required: true,
        },
        discountedPrice: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
            default: null,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
    },
    { _id: true, strict: false }
);

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required."],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, "Product slug is required."],
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required."],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        mainImages: {
            type: [String],
            default: [],
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        price: {
            type: Number,
            required: function () {
                return !this.hasVariations;
            },
        },
        discountedPrice: {
            type: Number,
            default: 0,
        },
        hasVariations: {
            type: Boolean,
            default: false,
        },
        variationTypeNames: {
            type: [String],
            default: [],
        },
        variations: {
            type: [variationSchema],
            default: [],
        },
    },
    { timestamps: true }
);

// Pre-save hook: generate slug using slugify
productSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            replacement: "-",
            trim: true,
        });
    }
    next();
});

const Product = mongoose.model("Product", productSchema);

export { Product };