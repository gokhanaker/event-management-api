import express from "express";
import { registerUser, login } from "../controllers/UserControllers";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);

export default router;
