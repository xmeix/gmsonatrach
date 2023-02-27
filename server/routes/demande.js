import express from "express";
import { checkCreateAccess, updateAccessCheck } from "../middleware/demande.js";
import {
  createDemande,
  getDemandes,
  updateDemEtat,
} from "../controllers/demande.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/**CREATE */
router.post("/:type", verifyToken, checkCreateAccess, createDemande);

/** READ */
router.get("/", verifyToken, getDemandes);

/** UPDATE ETAT */
router.patch("/:id", verifyToken, updateAccessCheck, updateDemEtat);

export default router;
