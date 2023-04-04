import express from "express";
import { getMissionKPIS } from "../controllers/Kpis.js";
import { verifyTokenAndResponsable } from "../middleware/auth.js";
import { getFilesKPIS } from "../controllers/FilesKpis.js";

const router = express.Router();

router.get("/mission", verifyTokenAndResponsable, getMissionKPIS);
router.get("/files", verifyTokenAndResponsable, getFilesKPIS);

export default router;
