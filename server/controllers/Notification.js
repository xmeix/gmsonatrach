import mongoose from "mongoose";
import Notification from "./../models/Notification.js";
import { emitGetData } from "./utils.js";

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
    await newNotification.populate("users");

    console.log("notifications");
    // emitData("notification");
    emitNotification({ others: newNotification.users });
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
    ).populate("users");
    // emitData("notification");
    emitNotification({ others: updatedNotification.users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const emitNotification = async (ids) => {
  let { others } = ids;
  let combinedUsers = others.map((u) => u._id.toString());
  console.log(combinedUsers);

  emitGetData(combinedUsers, "notification");
};
