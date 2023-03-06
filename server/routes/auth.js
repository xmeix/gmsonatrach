import express from "express";
import { login, register, logout, getAllUsers } from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
