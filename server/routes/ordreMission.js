import express from "express";
import { createOrdreMission, getAllOrdresMissions } from "../controllers/ordreMission.js";
import { verifyToken, verifyTokenAndSec } from "../middleware/auth.js";
import { checkMissionEmpExistence } from "../middleware/ordreMission.js";


const router = express.Router();


/**CREATE */
router.post("/", verifyTokenAndSec, checkMissionEmpExistence, createOrdreMission);

/** READ */
router.get("/", verifyToken, getAllOrdresMissions);


export default router;