import express from "express";
import {
  login,
  register,
  logout,
  getAllUsers,
  refresh,
  deleteUser,
  alterUser,
} from "../controllers/auth.js";
import { verifyToken, verifyTokenAndResponsable } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", verifyTokenAndResponsable, getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/refresh", refresh);
router.delete("/user/:id", verifyToken, deleteUser);
router.patch("/user/:id", verifyToken, alterUser);
export default router;
