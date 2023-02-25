import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createDepense , getAllDepenses,DeleteDepense} from "../controllers/depense.js";

const router = express.Router();


/* CREATE**/
router.post("/", verifyToken, createDepense);

/** READ */
router.get("/",verifyToken,getAllDepenses);

/** Delete  */
router.delete("/:id",verifyToken,DeleteDepense);
export default router;