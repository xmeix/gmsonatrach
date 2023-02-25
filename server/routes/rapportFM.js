import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { checkCreateAccess } from "../middleware/rapportFM.js";
import { createRapport , getAllRapports } from "../controllers/rapportFM.js";


const router = express.Router();

/* CREATE**/
router.post("/", verifyToken,checkCreateAccess, createRapport);

/** READ */
router.get("/",verifyToken,getAllRapports);



export default router;