import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export default function generateToken(payload) {
    console.log("Generating token with payload:", JWT_SECRET, payload);
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};