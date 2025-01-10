import { registerUser, login } from "../controllers/AuthControllers";
import express from "express";

const router = express.Router();

router.post("/register", registerUser as express.RequestHandler); // Mapping routes to controller methods
router.post("/login", login as unknown as express.RequestHandler);

export default router;
