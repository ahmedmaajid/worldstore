import mongoose from "mongoose"
import slugify from "slugify"

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, index: true },   // <-- not required
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    image: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});

CategorySchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

// Unique slug per parent
CategorySchema.index({ slug: 1, parentId: 1 }, { unique: true });

export const Category = mongoose.model("Category", CategorySchema);
