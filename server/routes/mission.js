import express from "express";
import {
  createMission,
  updateMissionEtat,
  getAllMissions,
} from "../controllers/mission.js";
import { checkUpdateMissionAccess } from "../middleware/mission.js";
import { verifyToken, verifyTokenAndSec } from "../middleware/auth.js";

const router = express.Router();

/**CREATE */
router.post("/", verifyTokenAndSec, createMission);

/** READ */
router.get("/", verifyToken, getAllMissions);
//consulter une seule mission (EMP == que sa mission, SEC ET DIR n'importe quelle mission)
//router.get("/:id", verifyToken, getMission);

//pour les etats et les types y en a des fonctions reactjs pour les filtrer
router.patch("/:id", verifyToken, checkUpdateMissionAccess, updateMissionEtat);

export default router;
