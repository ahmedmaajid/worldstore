import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:5173", // your React app
    credentials: true,
}));
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
