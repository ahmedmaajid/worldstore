import express from "express";
import { registerUser, loginUser, checkAuth } from "../controllers/authController.js";

const router = express.Router();

router.post("/create-user", registerUser);
router.post("/login", loginUser);
router.get("/check", checkAuth)

export default router;
