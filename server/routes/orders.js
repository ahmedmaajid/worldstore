import express from "express";
import { createOrder, cancelOrder, getOrders, createDirectOrder, fetchOrder } from "../controllers/orderController.js";
import { attachUserIfExists, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.post("/create-direct", attachUserIfExists, createDirectOrder)
router.get("/fetch-all-orders", protect, getOrders);
router.get("/fetch-order/:id", protect, fetchOrder);
router.put("/cancel/:id", protect, cancelOrder);

export default router;
