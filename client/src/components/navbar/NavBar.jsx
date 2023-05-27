import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/Menu";
import MenuBar from "../menuBar/MenuBar";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  titles,
  employeTitles,
  relexTitles,
  secTitles,
} from "../../data/navdata";
import { useAxios } from "../../hooks/useAxios";
import { v4 as uuidv4 } from "uuid";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { socket } from "../../App";
import { getNotifications } from "../../api/apiCalls/getCalls";
import Notification from "../notification/Notification";
const NavBar = () => {
  const { user, isLoggedIn, notifications } = useSelector(
    (state) => state.auth
  );
  /**_______________________________________________________________________________ */
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const notificationsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    if (isLoggedIn) {
      if (socket) {
        socket.on("notification", async () => {
          // console.log("new notification received");
          getNotifications(dispatch, 1);
        });
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, isLoggedIn, notificationsRef]);
  function handleNotificationsClick() {
    setShowNotifications((prev) => !prev);
  }
  /**_______________________________________________________________________________ */

  const navLinkStyle = ({ isActive }) => {
    return {
      color: isActive ? "var(--orange)" : "var(--black)",
      fontWeight: isActive ? "700" : "600",
    };
  };
  const [isOpen, setIsOpen] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const { callApi } = useAxios();

  const [navData] = useState(() => {
    switch (user?.role) {
      case "directeur":
      case "responsable":
        return titles;
      case "secretaire":
        return secTitles;
        break;
      case "employe":
        return employeTitles;
      case "relex":
        return relexTitles;
      default:
        return [];
    }
  });
  const [profileTitle] = useState(() => {
    switch (user?.role) {
      case "directeur":
        return "Directeur";
        break;
      case "responsable":
        return "Sous-directeur";
        break;
      case "secretaire":
        return "Secrétaire";
        break;
      case "relex":
        return "Service Relex";
        break;
      case "employe":
        return "Employé";
        break;
      default:
        "";
    }
  });

  const handleMenu = () => {
    setIsOpen(true);
  };
  const handleHideMenu = () => {
    setIsOpen(false);
  };
  //____________________________________________________
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  //____________________________________________________
  useEffect(() => {
    function handleWindowResize() {
      if (getWindowSize().innerWidth <= 1098) {
        setResponsive(true);
      } else {
        setResponsive(false);
        setIsOpen(false);
      }
    }
    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  const handleLogout = (e) => {
    e.preventDefault();
    //logout();
    callApi("post", "/auth/logout", {});
  };
  return (
    <div className="navbar">
      {showNotifications && (
        <div className="notification-list" ref={notificationsRef}>
          {notifications.length === 0 ? (
            <div className="empty">Pas de nouvelles notifications</div>
          ) : (
            <div className="notifications">
              {notifications.map((notification, index) => (
                <Notification key={index} notification={notification} />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="list">
        {isOpen && (
          <CloseRoundedIcon className="icon" onClick={handleHideMenu} />
        )}
        {isOpen && <MenuBar titles={navData} />}
        {!isOpen && responsive && (
          <MenuRoundedIcon className="icon" onClick={handleMenu} />
        )}
        {isOpen && <div className="hideDiv" onClick={handleHideMenu}></div>}
        <div className="profileTitle">
          {/* {profileTitle} :{" "} */}
          <span
            style={{
              fontSize: "13px",
              color: "var(--black)",
              textTransform: "capitalize",
            }}
          >
            {user.nom + " " + user.prenom}
          </span>
        </div>
        {!responsive && (
          <ul className="sublist">
            {navData.map((title, i) => (
              <li key={title.id}>
                <NavLink to={title.path} className="link" style={navLinkStyle}>
                  {title.title}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2em",
        }}
      >
        <div className="notif">
          <NotificationsNoneRoundedIcon
            className="icon"
            onClick={handleNotificationsClick}
          />
          <div className="notif-number">{notifications.length}</div>
        </div>
        <button type="button" className="logoutBtn" onClick={handleLogout}>
          logout
        </button>
      </div>
    </div>
  );
};
export default NavBar;
