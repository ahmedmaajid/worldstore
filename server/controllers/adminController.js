import cloudinary from "../utils/cloudinary.js";
import { Category } from "../models/categories.js";
import User from "../models/users.js";
import commerce from "../models/commerce.js"
import { Product } from "../models/products.js";
import slugify from "slugify";
import Order from "../models/orders.js"


export const isAdmin = async (req, res) => {
    return res.json({ isAdmin: req.user.isAdmin });
}

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

// export const getCustomers = async (req, res) => {
//     try {
//         const customers = await User.find();
//         res.json(customers)
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error })
//     }
// }

export const getCustomers = async (req, res) => {
    try {
        // Get all users
        const users = await User.find().lean();

        // For each user, get their orders and calculate stats
        const customersWithOrders = await Promise.all(
            users.map(async (user) => {
                // Get orders for this user
                const userOrders = await Order.find({ user: user._id }).lean();

                // Calculate stats
                const totalOrders = userOrders.length;
                const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
                const lastOrder =
                    userOrders.length > 0
                        ? new Date(
                            Math.max(...userOrders.map((o) => new Date(o.createdAt)))
                        ).toLocaleDateString()
                        : null;

                // Format orders for frontend
                const formattedOrders = userOrders.map((order) => ({
                    id: order.orderNumber,
                    date: new Date(order.createdAt).toLocaleDateString(),
                    status: order.status,
                    amount: order.total,
                }));

                return {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt,
                    totalOrders,
                    totalSpent,
                    lastOrder,
                    orders: formattedOrders,
                };
            })
        );

        res.json(customersWithOrders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const addProduct = async (req, res) => {
    console.log("🟢 Add product request received");

    try {
        const {
            name,
            description,
            category,
            price,
            discountedPrice,
            stock,
            variationTypes,
            variations,
        } = req.body;

        // Validate required fields
        if (!name || !description || !category) {
            console.log("❌ Missing fields:", { name, description, category });
            return res.status(400).json({ message: "Required fields missing" });
        }

        // Parse variations
        let parsedTypes = [];
        let parsedVariations = [];
        try {
            parsedTypes = variationTypes ? JSON.parse(variationTypes) : [];
            parsedVariations = variations ? JSON.parse(variations) : [];
        } catch (err) {
            console.log("❌ Failed to parse JSON:", err.message);
        }

        // Upload main and sub images
        let uploadedMainImages = [];
        let uploadedSubImages = [];

        if (req.files?.mainImage) {
            const mainUpload = await cloudinary.uploader.upload(
                req.files.mainImage[0].path,
                { folder: "worldstore/product/main" }
            );
            uploadedMainImages.push(mainUpload.secure_url);
        }

        if (req.files?.subImages) {
            for (let file of req.files.subImages) {
                const subUpload = await cloudinary.uploader.upload(file.path, {
                    folder: "worldstore/product/sub",
                });
                uploadedSubImages.push(subUpload.secure_url);
            }
        }

        // ✅ ADD THIS: Upload variation images
        let uploadedVariationImages = [];
        if (req.files?.variationImages) {
            console.log("🖼 Uploading variation images...");
            for (let file of req.files.variationImages) {
                const varUpload = await cloudinary.uploader.upload(file.path, {
                    folder: "worldstore/product/variations",
                });
                uploadedVariationImages.push(varUpload.secure_url);
            }
        }

        // ✅ ADD THIS: Map uploaded variation images to variations
        const variationsWithImages = parsedVariations.map((variation, index) => ({
            ...variation,
            image: uploadedVariationImages[index] || null,
            discountedPrice: variation.discountedPrice || null
        }));

        const newProduct = new Product({
            name,
            description,
            category,
            price: price || 0,
            discountedPrice: discountedPrice || 0,
            inStock: stock === "true" || stock === true,
            hasVariations: parsedVariations.length > 0,
            variationTypeNames: parsedTypes,
            variations: variationsWithImages, // ✅ Use the mapped variations
            mainImages: [...uploadedMainImages, ...uploadedSubImages],
            slug: slugify(name, { lower: true, strict: true })
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct,
        });
    } catch (error) {
        console.error("🔥 Error in addProduct:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error })
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, discountedPrice, stock, variations, variationTypes } = req.body;

        // 1. Find the product by its ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // 2. Handle new image uploads (main, sub, and variation images)
        const newImages = {
            main: product.mainImages[0],
            sub: product.mainImages.slice(1),
            variations: product.variations,
        };

        if (req.files.mainImage) {
            const result = await cloudinary.uploader.upload(req.files.mainImage[0].path);
            newImages.main = result.secure_url;
        }

        if (req.files.subImages) {
            for (const file of req.files.subImages) {
                const result = await cloudinary.uploader.upload(file.path);
                newImages.sub.push(result.secure_url);
            }
        }

        // Update variation images
        if (req.files.variationImages) {
            const parsedVariations = JSON.parse(variations);
            let variationImageIndex = 0;
            for (const combo of parsedVariations) {
                if (combo.isNewImage) {
                    const result = await cloudinary.uploader.upload(req.files.variationImages[variationImageIndex].path);
                    combo.image = result.secure_url;
                    variationImageIndex++;
                }
            }
            newImages.variations = parsedVariations;
        } else {
            newImages.variations = JSON.parse(variations);
        }


        // 3. Update the product document in the database
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                category,
                price,
                discountedPrice,
                stock,
                mainImages: [newImages.main, ...newImages.sub],
                variations: newImages.variations,
                variationTypeNames: JSON.parse(variationTypes),
                hasVariations: JSON.parse(variationTypes).length > 0,
            },
            { new: true } // returns the updated document
        );

        res.status(200).json(updatedProduct);

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }

}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted successfully", success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const deleteVariation = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("variation id", id)
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid variation ID" });
        }

        // 1. Find the product containing this variation
        const product = await Product.findOne({ "variations._id": id });
        if (!product) {
            return res.status(404).json({ message: "Product or variation not found" });
        }

        // 2. Remove the variation from the array
        product.variations = product.variations.filter(
            (v) => v._id.toString() !== id
        );

        // 3. Update hasVariation
        product.hasVariations = product.variations.length > 0;

        // 4. Save changes
        await product.save();

        res.json({ message: "Variation deleted", success: true });
    } catch (error) {
        console.error("Delete variation error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// export const deleteVariation = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ message: "Invalid variation ID" });
//         }

//         const product = await Product.findOneAndUpdate(
//             { "variations._id": id },
//             { $pull: { variations: { _id: id } } },
//             { new: true } // Return the updated document
//         );

//         if (!product) {
//             return res.status(404).json({ message: "Product or variation not found" });
//         }

//         res.json({ message: "Variation deleted", success: true });
//     } catch (error) {
//         console.error("Delete variation error:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
export const addShippingDetails = async (req, res) => {
    try {
        const { shippingFee, freeShippingOver } = req.body;

        let shop = await commerce.findOne();
        if (!shop) {
            shop = new commerce({ shippingFee, freeShippingOver });
        } else {
            shop.shippingFee = shippingFee;
            shop.freeShippingOver = freeShippingOver;
        }

        await shop.save();
        res.status(200).json(shop);
    } catch (err) {
        res.status(500).json({ message: "Error saving shipping details", error: err });
    }
};

export const addCouponDetails = async (req, res) => {
    try {
        const { code, discountType, discountValue } = req.body;
        console.log(req.body)

        let shop = await commerce.findOne();
        if (!shop) {
            shop = new commerce({ coupons: [] });
        }

        // check if coupon exists
        const existingIndex = shop.coupons.findIndex(c => c.code === code);
        if (existingIndex !== -1) {
            // update existing
            shop.coupons[existingIndex] = { code, discountType, discountValue };
        } else {
            // add new coupon
            shop.coupons.push({ code, discountType, discountValue });
        }

        await shop.save();
        res.status(200).json(shop.coupons);
    } catch (err) {
        res.status(500).json({ message: "Error saving coupon", error: err });
    }
};

export const deleteShippingFee = async (req, res) => {
    try {
        const shop = await commerce.findOne();
        if (!shop) return res.status(404).json({ message: "No shop found" });

        shop.shippingFee = null;
        shop.freeShippingOver = null;

        await shop.save();
        res.status(200).json({ status: 200, message: "Shipping deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shipping", error });
    }
}

// backend
export const deleteCoupon = async (req, res) => {
    try {
        const { code } = req.query; // <- use query
        const shop = await commerce.findOne();
        if (!shop) return res.status(404).json({ message: "No shop found" });

        shop.coupons = shop.coupons.filter((c) => c.code !== code);
        await shop.save();
        res.status(200).json({ status: 200, message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting coupon", error });
    }
};


export const getCommerceData = async (req, res) => {
    try {
        const data = await commerce.find();
        res.json(data)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}