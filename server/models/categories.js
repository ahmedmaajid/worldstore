import mongoose from "mongoose"
import slugify from "slugify"

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
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

export const Category = mongoose.model("Category", CategorySchema)
