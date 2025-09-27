import express from "express";
import { createOrder, cancelOrder, getOrders, createDirectOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.post("/create-direct", createDirectOrder)
router.get("/fetch-all-orders", protect, getOrders);
router.put("/cancel/:id", protect, cancelOrder);

export default router;
