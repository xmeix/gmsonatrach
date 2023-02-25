import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createTache , getAllTaches,DeleteTache } from "../controllers/tache.js";

const router = express.Router();


/* CREATE**/
router.post("/", verifyToken, createTache);

/** READ */
router.get("/",verifyToken,getAllTaches);

/** Delete  */
router.delete("/:id",verifyToken,DeleteTache);
export default router;