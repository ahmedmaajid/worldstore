import dotenv from "dotenv"
dotenv.config();


import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Allow both the production frontend and local dev frontend for CORS
const allowedOrigins = [
    "https://worldstore-client.vercel.app",
    "http://localhost:5173", // Vite default dev server
    "http://127.0.0.1:5173",
];

app.use(
    cors({
        origin: (origin, callback) => {
            // allow requests with no origin (like mobile apps, curl, server-to-server)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("CORS policy: This origin is not allowed."));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/", adminRoutes)

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
