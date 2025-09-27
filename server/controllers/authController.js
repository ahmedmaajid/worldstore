import User from "../models/users.js"
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken"

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: "error", message: "Incorrect Email" });
        }

        if (!user.password) {
            return res.json({ status: "error", message: "No password in DB" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ status: "error", message: "Incorrect Password" });
        }

        // 🎯 Key change: Extract the isAdmin field from the user document
        const { password: pwd, isAdmin, ...userData } = user._doc;

        // 🎯 Include isAdmin in the payload for the token
        const payload = { id: user._id, email: user.email, isAdmin: user.isAdmin };
        const token = generateToken(payload);

        console.log("Token", token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });

        // 🎯 Include isAdmin in the response body for immediate use by the frontend
        res.status(200).json({
            message: "Login successful",
            status: "success",
            user: { ...userData, isAdmin }
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const newUser = await User.create({ firstName, lastName, email, password });
        await newUser.save();

        const payload = { id: newUser._id, email: newUser.email };
        const token = generateToken(payload);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        res.status(201).json({ message: "User created successfully", status: "success", user: { firstName, lastName, email } });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message, status: "error" });
    }
};

export const logOut = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date(0)
        });
        res.json({ message: "Logged out successfully!" });
    } catch (error) {
        res.json({ message: error })
    }

}

export const checkAuth = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ isLoggedIn: false, isAdmin: false });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("isAdmin");
        res.json({ isLoggedIn: true, isAdmin: user.isAdmin, userId: decoded.id });
    } catch {
        res.json({ isLoggedIn: false, isAdmin: false, userId: null });
    }
};
