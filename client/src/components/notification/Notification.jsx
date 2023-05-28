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

  const notificationTypes = () => {
    switch (user?.role) {
      case "directeur":
      case "secretaire":
      case "responsable":
        return notific;
      case "employe":
        return employeNotific;
      case "relex":
        return relexNotific;
      default:
        return [];
    }
  };

  const formattedDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options).split("/").join("-");
  };

  const type = notificationTypes().type;
  const path = notificationTypes().path;

  return (
    <NavLink
      onClick={() => {
        if (!notification.isRead) {
          callApi("patch", `/notification/${notification._id}`, {
            isRead: true,
          });
        }
      }}
      to={notification.type === type ? path : "/"}
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
