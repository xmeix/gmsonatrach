import { useState } from "react";
import "./Notification.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { employeNotific, notific, relexNotific } from "../../data/navdata";
import { convertLength } from "@mui/material/styles/cssUtils";
import { useAxios } from "../../hooks/useAxios";

const Notification = ({ notification }) => {
  const { user } = useSelector((state) => state.auth);
  const { callApi } = useAxios();

  const formattedDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options).split("/").join("-");
  };

  // const getNotificationTypes = () => {
  //   switch (user?.role) {
  //     case "directeur":
  //     case "secretaire":
  //     case "responsable":
  //       return notific;
  //     case "employe":
  //       return employeNotific;
  //     case "relex":
  //       return relexNotific;
  //     default:
  //       return [];
  //   }
  // };

  // const [notificationTypes] = useState(getNotificationTypes);
  // const { type, path } = notificationTypes.find(
  //   (item) => item.type === notification.type
  // ) || { type: "", path: "/" };
  return (
    <NavLink
      onClick={() => {
        if (!notification.isRead) {
          callApi("patch", `/notification/${notification._id}`, {
            isRead: true,
          });
        }
      }}
      to={notification.path}
      className={`notification link ${
        notification.isRead ? "isRead" : "notRead"
      }`}
    >
      <div className="message">{notification.message}</div>
      <div className="date">{formattedDate(notification.createdAt)}</div>
    </NavLink>
  );
};

export default Notification;
