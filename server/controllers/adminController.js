import cloudinary from "../utils/cloudinary.js";
import { Category } from "../models/categories.js";

export const addCategory = async (req, res) => {
    try {
        const { name, parentId } = req.body;

        // Validate required fields
        if (!name || name.trim() === '') {
            return res.status(400).json({
                error: "Category name is required",
                status: "error"
            });
        }

        let imageUrl = null;

        // Upload image if exists
        if (req.file) {
            try {
                const uploaded = await cloudinary.uploader.upload(req.file.path, {
                    folder: "worldstore/categories",
                });
                imageUrl = uploaded.secure_url;
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(500).json({
                    error: "Failed to upload image",
                    status: "error"
                });
            }
        }

        let parent = null;

        if (parentId && parentId.trim() !== '') {
            try {
                parent = await Category.findById(parentId);
                if (!parent) {
                    return res.status(400).json({
                        error: "Parent category not found",
                        status: "error"
                    });
                }
            } catch (dbError) {
                console.error("Database error finding parent:", dbError);
                return res.status(400).json({
                    error: "Invalid parent category ID",
                    status: "error"
                });
            }
        }

        const categoryData = {
            name: name.trim(),
            parentId: parent ? parent._id : null,
            image: imageUrl,
        };

        console.log("Creating category with data:", categoryData);

        const newCategory = await Category.create(categoryData);

        console.log("Category created successfully:", newCategory);

        res.status(201).json({
            category: newCategory,
            status: "success",
            message: "Category added successfully"
        });
    } catch (err) {
        console.error("Error in addCategory:", err);
        console.error("Error stack:", err.stack);
        res.status(500).json({
            error: err.message,
            status: "error"
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log("Found categories:", categories.length);
        res.json(categories);
    } catch (err) {
        console.error("Error in getCategories:", err);
        res.status(500).json({
            error: err.message,
            status: "error"
        });
    }
};

export const updateCategory = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, parentId } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        let imageUrl = existingCategory.image;

        if (req.file) {
            try {
                const uploaded = await cloudinary.uploader.upload(req.file.path, {
                    folder: "worldstore/categories",
                });
                imageUrl = uploaded.secure_url;
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload image",
                });
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                name: name.trim(),
                parentId: (parentId && parentId.trim() !== '') ? parentId : null,
                image: imageUrl,
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory,
        });
    } catch (error) {
        console.error("Error updating category:", error);
        console.error("Error stack:", error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const hasChildren = await Category.exists({ parentId: id });
        if (hasChildren) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category that has subcategories. Please delete subcategories first."
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};