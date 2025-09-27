import express from "express";
import { getProducts, getProduct, getCategories, getCategoryData, getProductsByCategory, getProductsByCategoryIds, addToCart, addToWishlist, getCartItems, removeCartItem, getWishlistData, removeWishlistItem, addToCartFromWishlist } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/fetch-products", getProducts);
router.get("/get-products-by-category", getProductsByCategory)
router.get("/get-product/:slug", getProduct);
router.get("/fetch-categories", getCategories)
router.get("/get-category-data", getCategoryData)
router.post("/get-products-by-category-ids", getProductsByCategoryIds);


router.post("/add-to-cart", protect, addToCart)
router.post("/add-to-wishlist", protect, addToWishlist)
router.get("/get-cart-items/", protect, getCartItems)
router.delete("/remove-cart-item/:id", protect, removeCartItem)
router.get("/get-wishlist-data", protect, getWishlistData)
router.delete("/remove-wishlist-item/:id", protect, removeWishlistItem)
router.post("/add-to-cart-from-wishlist", protect, addToCartFromWishlist)
export default router;
