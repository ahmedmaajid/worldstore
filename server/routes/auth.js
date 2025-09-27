import express from "express";
import { registerUser, loginUser, checkAuth, logOut } from "../controllers/authController.js";

const router = express.Router();

router.post("/create-user", registerUser);
router.post("/login", loginUser);
router.get("/check", checkAuth)
router.post("/log-out", logOut)

export default router;
