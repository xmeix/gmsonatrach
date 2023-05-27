import { useState } from "react";
import "./Notification.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Notification = ({ notification }) => {
  const { user } = useSelector((state) => state.auth);
  
  const [navData] = useState(() => {
    switch (user?.role) {
      case "directeur":
      case "secretaire":
      case "responsable":
        return [];
      case "employe":
        return [];
      case "relex":
        return [];
      default:
        return [];
    }
  });

  return (
    <NavLink to={notification.path} className="notification link">
      <div className="message">{notification.message}</div>{" "}
      <div className="date">
        {new Date(notification.createdAt)
          .toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })
          .split("/")
          .join("-")}
      </div>
    </NavLink>
  );
};

export default Notification;
