import { registerUser, login } from "@/controllers/AuthControllers";
import { Router } from "express";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);

export default router;
