import mongoose from "mongoose";
import cart from "../models/cart.js";
import { Category } from "../models/categories.js";
import { Product } from "../models/products.js"
import Wishlist from "../models/wishlist.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        console.log("Products fetched:", products);
        res.json(products)
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;

    }
}
// export const getProductsByCategory = async (req, res) => {
//     try {
//         const { slug } = req.query;
//         if (!slug) return res.status(400).json({ message: "Slug required" });

//         // Get category
//         const slugs = slug.split("/");
//         let parent = null;
//         let category = null;

//         for (const s of slugs) {
//             category = await Category.findOne({ slug: s, parentId: parent?._id || null });
//             if (!category) return res.status(404).json({ message: "Category not found" });
//             parent = category;
//         }

//         // Fetch products with this category
//         const products = await Product.find({ category: category._id });
//         res.json({ category, products });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}
export const getCategoryData = async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ message: "Slug is required" });

        const slugs = slug.split("/"); // e.g., ["cosmetic-items","women","perfumes"]

        let parent = null;
        const categoriesPath = [];

        for (const s of slugs) {
            const category = await Category.findOne({ slug: s, parentId: parent?._id || null });
            if (!category) return res.status(404).json({ message: "Category not found" });
            categoriesPath.push(category);
            parent = category;
        }

        // Fetch subcategories for each category in the path
        const allSubCategories = {};
        for (const cat of categoriesPath) {
            const subs = await Category.find({ parentId: cat._id });
            allSubCategories[cat.slug] = subs;
        }

        res.json({ categoriesPath, allSubCategories });
    } catch (error) {
        console.error("Error in getCategoryData:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// export const getCategoryData = async (req, res) => {
//     try {
//         const { slug } = req.query;

//         if (!slug) {
//             return res.status(400).json({ message: "Slug is required" });
//         }

//         const category = await Category.findOne({ slug });
//         if (!category) {
//             return res.status(404).json({ message: "Category not found" });
//         }

//         const subCategories = await Category.find({ parentId: category._id });

//         res.json({ category, subCategories });
//     } catch (error) {
//         console.error("Error in getCategoryData:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
export const getProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        console.log("slug", slug)
        const product = await Product.findOne({ slug: { $regex: `^${slug}$`, $options: "i" } });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const getAllChildCategoryIds = async (parentId) => {
    const children = await Category.find({ parentId });
    let ids = children.map(c => c._id);

    for (const child of children) {
        const subIds = await getAllChildCategoryIds(child._id);
        ids = ids.concat(subIds);
    }

    return ids;
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { slug } = req.query;
        if (!slug) return res.status(400).json({ message: "Slug required" });

        const slugs = slug.split("/");
        let parent = null;
        let category = null;

        for (const s of slugs) {
            category = await Category.findOne({ slug: s, parentId: parent?._id || null });
            if (!category) return res.status(404).json({ message: "Category not found" });
            parent = category;
        }

        const childIds = await getAllChildCategoryIds(category._id);

        const allCategoryIds = [category._id, ...childIds];

        const products = await Product.find({ category: { $in: allCategoryIds } });
        res.json({ category, products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// POST /api/products/get-products-by-category-ids
export const getProductsByCategoryIds = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Category IDs required" });
        }

        let allIds = [];
        for (const id of ids) {
            const childIds = await getAllChildCategoryIds(id);
            allIds.push(id, ...childIds);
        }

        const products = await Product.find({ category: { $in: allIds } });
        res.json({ products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



// Add to cart and wishlist
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId))
            return res.json({
                message: "Please log in or create an account to add items to your cart",
            });

        const { productId, productName, productImage, variationId, variationName, price, quantity } = req.body;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId))
            return res.status(400).json({ message: "Invalid product ID" });
        if (!productName || !price || !quantity)
            return res.status(400).json({ message: "Missing required fields" });

        const cleanName = productName.trim();
        const cleanVariation = variationName?.trim() || null;
        const cleanImage = productImage.trim();

        // Check if this product (with same variation) already exists in user's cart
        const existingItem = await cart.findOne({
            userId,
            productId,
            variationId: variationId || null,
        });

        if (existingItem) {
            // Update quantity and totalPrice
            existingItem.quantity += quantity;
            existingItem.totalPrice = existingItem.quantity * price;
            await existingItem.save();

            return res.status(200).json({
                message: "Cart updated",
                cartItem: existingItem,
            });
        }

        // Create new cart item if it doesn't exist
        const cartItem = new cart({
            userId,
            productId,
            productName: cleanName,
            productImage: cleanImage,
            variationId: variationId || null,
            variationName: cleanVariation,
            price,
            quantity,
            totalPrice: price * quantity,
        });

        await cartItem.save();

        return res.status(201).json({ message: "Item added to cart", cartItem });
    } catch (error) {
        console.error("Add to cart error:", error);
        return res.status(500).json({ message: "Server error, try again later" });
    }
};

// export const addToWishlist = async (req, res) => {
//     try {
//         const userId = req.user?._id;
//         if (!userId || !mongoose.Types.ObjectId.isValid(userId))
//             return res.status(401).json({ message: "Please log in to add items to wishlist" });

//         const { productId, variationId } = req.body;

//         if (!productId || !mongoose.Types.ObjectId.isValid(productId))
//             return res.status(400).json({ message: "Invalid product ID" });

//         const cleanVariationId = variationId || null;

//         // Try to add, or increase if duplicate exists
//         const wishlistItem = await Wishlist.findOneAndUpdate(
//             { userId, productId, variationId: cleanVariationId },
//             { $setOnInsert: { userId, productId, variationId: cleanVariationId } },
//             { new: true, upsert: true } // creates if not exists
//         );

//         return res.status(201).json({ message: "Item added to wishlist", wishlistItem });
//     } catch (error) {
//         console.error("Add to wishlist error:", error);
//         return res.status(500).json({ message: "Server error, try again later" });
//     }
// };


export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(401).json({ message: "Please log in to add items to wishlist" });
        }

        const { productId, variationId } = req.body;

        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Build filter and setOnInsert dynamically
        const filter = { userId, productId };
        const setOnInsert = { userId, productId };

        if (variationId) {
            filter.variationId = variationId;
            setOnInsert.variationId = variationId;
        }

        const wishlistItem = await Wishlist.findOneAndUpdate(
            filter,
            { $setOnInsert: setOnInsert },
            { new: true, upsert: true }
        );

        return res.status(201).json({ message: "Item added to wishlist", wishlistItem });
    } catch (error) {
        console.error("Add to wishlist error:", error);
        return res.status(500).json({ message: "Server error, try again later" });
    }
};


export const addToCartFromWishlist = async (req, res) => {
    try {
        const userId = req.user?._id; // from auth middleware
        if (!userId) {
            return res.status(401).json({ message: "User is not authenticated!" });
        }

        const item = req.body;
        if (!item || !item.productId) {
            return res.status(400).json({ message: "Invalid item data" });
        }

        const existing = await cart.findOne({
            userId,
            productId: item.productId,
            variationId: item.variationId || null,
        });

        if (existing) {
            existing.quantity += item.quantity || 1;
            existing.totalPrice = existing.quantity * existing.price;
            await existing.save();
            return res.json({ message: "Item updated in cart", cartItem: existing });
        }

        const cartItem = new cart({
            userId,
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            variationId: item.variationId || null,
            variationName: item.variationName || null,
            price: item.price,
            quantity: item.quantity || 1,
            totalPrice: (item.quantity || 1) * item.price,
        });

        await cartItem.save();

        return res.status(201).json({ message: "Item added to cart", cartItem });
    } catch (error) {
        console.error("Add to cart from wishlist error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getWishlistData = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "User is not authorized!" });

        const wishlistItems = await Wishlist.find({ userId }).populate({
            path: "productId",
            select:
                "name slug description mainImages inStock price discountedPrice hasVariations variations category",
            populate: { path: "category", select: "name" },
        });

        const formatted = wishlistItems.map((item) => {
            const product = item.productId;
            if (!product) return null;

            // find variation if exists
            let variation = null;
            if (item.variationId) {
                variation = product.variations.find(
                    (v) => v._id.toString() === item.variationId.toString()
                );
            }

            const price = variation ? variation.price : product.price;
            const discountedPrice = variation
                ? variation.discountedPrice || variation.price
                : product.discountedPrice || product.price;

            return {
                _id: item._id, // wishlist id
                userId: item.userId,
                productId: product._id,
                productName: product.name,
                productImage:
                    variation?.image || product.mainImages?.[0] || "/api/placeholder/300/300",
                category: product.category?.name || "Unknown",
                slug: product.slug,
                description: product.description,
                inStock: variation ? variation.inStock : product.inStock,
                hasVariations: product.hasVariations,
                variationId: variation?._id || null,
                variationName: variation?.displayName || null,
                price, // actual price
                discountedPrice,
                quantity: item.quantity || 1, // default 1 if not in schema
                totalPrice: (item.quantity || 1) * (discountedPrice || price),
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            };
        }).filter(Boolean);

        res.json({ wishlist: formatted });
    } catch (error) {
        console.error("Get wishlist error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// export const getWishlistData = async (req, res) => {
//     try {
//         const userId = req.user?.id;
//         if (!userId) return res.status(401).json({ message: "User is not authorized!" });

//         const wishlistItems = await Wishlist.find({ userId }).populate({
//             path: "productId",
//             select: "variationTypeNames category name slug description mainImages inStock price discountedPrice hasVariations variations",
//             populate: { path: "category", select: "name" } // <-- populate category name
//         });

//         const formatted = wishlistItems.map((item) => {
//             const product = item.productId;
//             const categoryName = product.category?.name || "Unknown"; // <-- use name
//             const variation = product.variations.find(
//                 (v) => v._id.toString() === item.variationId?.toString()
//             );

//             return {
//                 category: categoryName, // now it's the name
//                 wishlistId: item._id,
//                 productId: product._id,
//                 productName: product.name,
//                 slug: product.slug,
//                 description: product.description,
//                 mainImages: product.mainImages,
//                 inStock: product.inStock,
//                 price: product.price,
//                 discountedPrice: product.discountedPrice,
//                 hasVariations: product.hasVariations,
//                 variationId: variation?._id || null,
//                 variationName: variation?.name || null,
//                 variationPrice: variation?.price || product.price,
//             };
//         });

//         res.json({ wishlist: formatted });
//     } catch (error) {
//         console.error("Get wishlist error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };
export const removeWishlistItem = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!userId) return res.json({ message: "User is not authenticated!" });
    console.log(userId, id)

    try {
        const item = await Wishlist.findOne({ _id: id, userId: userId });
        if (!item) {
            return res.status(404).json({ message: "Item not found or not yours" });
        }

        await item.deleteOne();
        res.status(200).json({ message: "Item removed successfully!", id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};



// export const getCartItems = async (req, res) => {
//     try {
//         const userId = req.user?._id;
//         console.log("user id", userId)
//         const items = await cart.find({ userId }).populate("productId");
//         return res.status(200).json(items);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Failed to fetch cart items" });
//     }
// };

export const getCartItems = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Not authorized" });

        const items = await cart.find({ userId }).populate({
            path: "productId",
            select: "name slug mainImages variationTypeNames variations",
        });

        const formatted = items.map((item) => {
            const product = item.productId;
            const variation = product?.variations.find(
                (v) => v._id.toString() === item.variationId?.toString()
            );

            return {
                id: item._id,
                productId: product?._id,
                productName: product?.name,
                productImage: item.productImage || product?.mainImages?.[0] || null,
                variationId: item.variationId,
                variationName: variation?.displayName || null,
                attributes: variation?.attributes || {}, // 👈 send dynamic attributes
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                inStock: variation?.inStock ?? product?.inStock ?? true,
                createdAt: item.createdAt,
            };
        });

        res.status(200).json(formatted);
    } catch (error) {
        console.error("Get cart items error:", error);
        res.status(500).json({ message: "Failed to fetch cart items" });
    }
};


export const removeCartItem = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { id } = req.params; // cart item id

        if (!userId) {
            return res.status(401).json({ message: "User not logged in" });
        }

        if (!id) {
            return res.status(400).json({ message: "Item ID is required" });
        }

        // Find the cart item that belongs to this user
        const cartItem = await cart.findOne({ _id: id, userId });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Delete it
        await cart.findByIdAndDelete(id);

        res.json({ message: "Item removed successfully" });
    } catch (error) {
        console.error("Remove cart item error:", error);
        res.status(500).json({ message: "Server error, try again later" });
    }
};
