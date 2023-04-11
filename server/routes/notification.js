import express from "express";  
import { verifyToken } from "../middleware/auth.js";
import { createNotification, getNotifications } from "../controllers/Notification.js";

const router = express.Router();

/**CREATE */
router.post("/", verifyToken, createNotification);

/** READ */
router.get("/", verifyToken, getNotifications); 

export default router;
