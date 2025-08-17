import {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/EventControllers";
import { authenticateJWT } from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router.post("/", authenticateJWT, createEvent); // Protecting route with authenticateJWT middleware
router.get("/", authenticateJWT, getEvents);
router.get("/:id", authenticateJWT, getEvent as express.RequestHandler);
router.put("/:id", authenticateJWT, updateEvent as express.RequestHandler);
router.delete("/:id", authenticateJWT, deleteEvent as express.RequestHandler);

export default router;
