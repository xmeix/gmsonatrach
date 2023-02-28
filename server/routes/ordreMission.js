import express from "express";
import { getAllOrdresMissions } from "../controllers/ordreMission.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

/** READ */
router.get("/", verifyToken, getAllOrdresMissions);

export default router;
