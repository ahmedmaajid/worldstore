import User from "../models/users.js"
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken"

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ status: "error", message: "Incorrect Email" });

        if (!user.password) return res.json({ status: "error", message: "No password in DB" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ status: "error", message: "Incorrect Password" });

        const { password: pwd, ...userData } = user._doc;

        const payload = { id: user._id, email: user.email };
        const token = generateToken(payload)
        console.log("Token", token)
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        })

        res.status(200).json({ message: "Login successful", status: "success", user: userData });
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

export const checkAuth = async (req, res) => {
    const token = req.cookies.token
    if (!token) return res.json({ isLoggedIn: false });
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.json({ isLoggedIn: true });
    } catch {
        res.json({ isLoggedIn: false })
    }
}
