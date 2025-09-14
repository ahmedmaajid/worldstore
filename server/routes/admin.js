import express from "express";
import {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/adminController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const adminRoutes = express.Router();

// Add multer middleware to updateCategory route as well
adminRoutes.post("/addCategory", upload.single("image"), addCategory);
adminRoutes.put("/updateCategory/:id", upload.single("image"), updateCategory);
adminRoutes.delete("/deleteCategory/:id", deleteCategory);
adminRoutes.get("/getCategories", getCategories);

export default adminRoutes;