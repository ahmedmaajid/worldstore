import jwt from "jsonwebtoken";

import User from "../models/users.js";

export const protect = async (req, res, next) => {
    let token;

    // Check if the token cookie exists
    if (req.cookies.token) {
        try {
            // Get the token from the cookie
            token = req.cookies.token;

            // Verify the token using the JWT secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database and attach it to the request object
            // Exclude the password field
            req.user = await User.findById(decoded.id).select("-password");

            // Proceed to the next middleware or controller
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    // If no token is found
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// middleware/auth.js
export const requireAdmin = (req, res, next) => {
    // 1. Check if the user is authenticated (e.g., via session or token)
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: Please log in." });
    }
    // 2. Check if the authenticated user has the 'admin' role
    if (req.user.isAdmin !== true) {
        return res.status(403).json({ message: "Forbidden: You do not have admin access." });
    }
    // 3. If both checks pass, proceed to the next middleware or route handler
    next();
};

export const attachUserIfExists = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
        console.log("Invalid token, continuing as guest");
    }

    next();
};
