import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = Router();

// POST /api/users/register – Registrierung eines neuen Benutzers
router.post("/register", registerUser);

// POST /api/users/login – Einloggen und Erhalt eines JWT
router.post("/login", loginUser);

export default router;