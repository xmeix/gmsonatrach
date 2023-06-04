import express from "express";
import { deleteOm, getAllOrdresMissions } from "../controllers/ordreMission.js";
import { verifyToken } from "../middleware/auth.js";
const router = express.Router();

/** READ */
router.get("/", verifyToken, getAllOrdresMissions);
// DELETE
// router.delete("/:id", verifyToken, deleteOm);

export default router;
