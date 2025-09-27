import express from "express";
import {
    addCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    getCustomers,
    addProduct,
    getProduct,
    getSingleProduct,
    updateProduct,
    deleteVariation,
    addShippingDetails,
    addCouponDetails,
    deleteProduct,
    deleteCoupon,
    isAdmin,
    deleteShippingFee,
    getCommerceData
} from "../controllers/adminController.js";

import multer from "multer";
import bcrypt from "bcryptjs";
import User from "../models/users.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
const upload = multer({ dest: "uploads/" });

const adminRoutes = express.Router();
adminRoutes.get("/get-commerce-data", getCommerceData)

adminRoutes.use(protect, requireAdmin);
adminRoutes.get("/isAdmin", isAdmin)
adminRoutes.post("/addCategory", upload.single("image"), addCategory);
adminRoutes.put("/updateCategory/:id", upload.single("image"), updateCategory);
adminRoutes.delete("/deleteCategory/:id", deleteCategory);
adminRoutes.get("/getCategories", getCategories);


// Get customers
adminRoutes.get("/customers", getCustomers)


// Products
adminRoutes.post(
    "/addProduct",
    upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages" },
        { name: 'variationImages', maxCount: 20 }
    ]),
    addProduct
);


adminRoutes.get("/products", getProduct)
adminRoutes.get("/products/:id", getSingleProduct)
adminRoutes.patch("/products/:id",
    upload.fields(
        [
            { name: 'mainImage', maxCount: 1 },
            { name: 'subImages', maxCount: 5 },
            { name: 'variationImages', maxCount: 10 },
        ],
    ), updateProduct)
adminRoutes.delete("/products/:id", deleteProduct);



// variation
adminRoutes.delete("/variation/:id", deleteVariation)



// For Creating an initial admin user
// adminRoutes.get("/create-admin", async (req, res) => {
//     try {
//         const password = "admin123"; // strong one in real life

//         const adminUser = new User({
//             firstName: "Zainul",
//             lastName: "Hamthy",
//             email: "hamthyzainul4@gmail.com",
//             password: password,
//             isAdmin: true,
//         });

//         await adminUser.save();
//         res.json({ message: "Admin created", admin: adminUser });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Error creating admin" });
//     }
// });


adminRoutes.post("/add-shipping-details", addShippingDetails)
adminRoutes.post("/add-coupon-details", addCouponDetails)
adminRoutes.delete("/delete-coupon", deleteCoupon)
adminRoutes.delete("/delete-shipping-fee", deleteShippingFee)
export default adminRoutes;
