import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    message: {
      type: String,
      required: true,
    },
    path: {
      type: String,
    },
    type: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
