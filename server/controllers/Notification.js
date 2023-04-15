import mongoose from "mongoose";
import Notification from "./../models/Notification.js";
import { connectedUsers, io } from "../index.js";

export const createNotification = async (body) => {
  try {
    const { users, message, path, type } = body;

    const newNotification = new Notification({
      users,
      message,
      path,
      type,
    });
    await newNotification.save();
    // Emit the notification event to each socket ID associated with the user ID
    console.log("____________________________________________________")
    console.log(connectedUsers)
    console.log("____________________________________________________")
    connectedUsers.forEach((item) => {
      const { userId, socketId } = item; 
        io.to(socketId).emit("notification"); 
    });
  } catch (error) {
    console.log(error);
  }
};
export const getNotifications = async (req, res) => {
  try {
    const user = req.user.id;
    const notifications = await Notification.find({
      users: { $in: [user] },
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
