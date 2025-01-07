import express from "express";
import {
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/EventControllers";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.get("/:id", getEvent as express.RequestHandler);
router.put("/:id", updateEvent as express.RequestHandler);
router.delete("/:id", deleteEvent as express.RequestHandler);

export default router;
