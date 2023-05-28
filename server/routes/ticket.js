import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addComment,
  changeStatus,
  createTicket,
  getTickets,
} from "../controllers/Ticket.js";

const router = express.Router();

/* CREATE**/
router.post("/", verifyToken, createTicket);

/** READ */
router.get("/", verifyToken, getTickets);

/** UPDATE ADD COMMENT*/
router.patch("/:id/comments", verifyToken, addComment);

/** UPDATE STATE*/
router.patch("/:id/etat", verifyToken, changeStatus);

export default router;
