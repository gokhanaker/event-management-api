import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "@/controllers/EventControllers";
import { authenticateJWT, authorizeRoles } from "@/middleware/authMiddleware";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "organizer"),
  createEvent,
);
router.get("/", authenticateJWT, getEvents);
router.get("/:id", authenticateJWT, getEvent);
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "organizer"),
  updateEvent,
);
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "organizer"),
  deleteEvent,
);

export default router;
