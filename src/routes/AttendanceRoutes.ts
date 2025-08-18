import { attendEvent } from "@/controllers/AttendanceControllers";
import { authenticateJWT } from "@/middleware/authMiddleware";
import { Router } from "express";

const router = Router();

router.post("/:eventId", authenticateJWT, attendEvent);

export default router;
