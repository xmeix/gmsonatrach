import mongoose from "mongoose";
import Notification from "./../models/Notification.js";
import { emitData } from "./utils.js";

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
    emitData("notification");
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

export const alterNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    emitData("notification");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
