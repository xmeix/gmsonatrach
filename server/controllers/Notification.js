import mongoose from "mongoose";
import Notification from "./../models/Notification.js";
import { io } from "../index.js";

export const createNotification = async (req, res, body) => {
  const { users, message, path, type } = body;

  const newNotification = new Notification({
    users,
    message,
    path,
    type,
  });
  await newNotification.save();
  // emit a notification event to all sockets associated with the user id
  io.emit("notification");
};
export const getNotifications = async (req, res) => {
  try {
    const user = req.user.id;
    const notifications = await Notification.find({
      users: { $in: [user] },
    });
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
