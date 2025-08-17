import { attendEvent } from "../controllers/AttendanceControllers";
import { authenticateJWT } from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router.post("/:eventId", authenticateJWT, attendEvent);

export default router;
