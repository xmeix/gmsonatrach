import express from "express";
import { getMissionKPIS } from "../controllers/Kpis.js";
import { verifyTokenAndResponsable } from "../middleware/auth.js";

const router = express.Router();

router.get("/mission", verifyTokenAndResponsable, getMissionKPIS);

export default router;
