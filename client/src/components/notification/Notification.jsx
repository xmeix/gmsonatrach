import "./Notification.css";

const Notification = ({ notification }) => {
  return (
    <div className="notification">
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
    </div>
  );
};

export default Notification;
