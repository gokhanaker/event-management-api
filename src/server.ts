import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import eventRoutes from "./routes/EventRoutes";
import authRoutes from "./routes/AuthRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
