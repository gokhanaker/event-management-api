import attendanceRoutes from "./routes/AttendanceRoutes";
import eventRoutes from "./routes/EventRoutes";
import authRoutes from "./routes/AuthRoutes";
import connectDB from "./config/db";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
