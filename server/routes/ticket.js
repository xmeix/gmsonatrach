import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  addComment,
  changeStatus,
  createTicket,
  getEmployeesBySolvedTickets,
  getTickets,
} from "../controllers/Ticket.js";

const router = express.Router();

/* CREATE**/
router.post("/", verifyToken, createTicket);

/** READ */
router.get("/", verifyToken, getTickets);
router.get("/employes", verifyToken, getEmployeesBySolvedTickets);


/** UPDATE ADD COMMENT*/
router.patch("/comments/:id", verifyToken, addComment);

/** UPDATE STATE*/
router.patch("/etat/:id", verifyToken, changeStatus);

export default router;
