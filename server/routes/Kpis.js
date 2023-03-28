import express from "express";
import { verifyTokenAndResponsable } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", verifyTokenAndResponsable, getAllUsers);

export default router;
