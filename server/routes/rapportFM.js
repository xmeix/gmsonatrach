import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkUpdateAccessReport } from "../middleware/rapportFM.js";
import {
  // createRapport,
  getAllRapports,
  updateRapport,
} from "../controllers/rapportFM.js";

const router = express.Router();

/* CREATE**/
//router.post("/", verifyToken, checkCreateAccess, createRapport);

/** READ */
router.get("/", verifyToken, getAllRapports);

/**  PATCH STATE */
//Once it is accepted ==> the etat de la mission devient terminé et létat du missionnaire concerné ==> non-missionnaire
router.patch("/:id", verifyToken, checkUpdateAccessReport, updateRapport);

export default router;
