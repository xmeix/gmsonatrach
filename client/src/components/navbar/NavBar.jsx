import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/Menu";
import MenuBar from "../menuBar/MenuBar";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "../../hooks/useAxios";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

import Notification from "../notification/Notification";
import DropdownMenu from "../dropdown/DropdownMenu";
import {
  mainDirRoutes,
  mainEmpRoutes,
  mainRelexRoutes,
  mainResRoutes,
  mainSecRoutes,
} from "../../App";
export const navLinkStyle = ({ isActive }) => {
  return {
    color: isActive ? "var(--orange)" : "var(--black)",
    fontWeight: isActive ? "700" : "600",
  };
};
export const NotNavLinkStyle = ({ isActive }) => {
  return {
    color: "var(--black)",
    fontWeight: isActive ? "700" : "600",
  };
};
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
        !event.target.classList.contains("icon") &&
        !event.target.closest(".notification-list")
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, isLoggedIn, notificationsRef]);
  function handleNotificationsClick() {
    setShowNotifications((prev) => !prev);
  }
  /**_______________________________________________________________________________ */

  const [isOpen, setIsOpen] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const { callApi } = useAxios();

  const [navData] = useState(() => {
    switch (user?.role) {
      case "directeur":
        return mainDirRoutes;
      case "responsable":
        return mainResRoutes;
      case "secretaire":
        return mainSecRoutes;
        break;
      case "employe":
        return mainEmpRoutes;
      case "relex":
        return mainRelexRoutes;
      default:
        return [];
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

  const renderSubMenu = (path, subroutes) => {
    return (
      <ul>
        {subroutes.map((subroute, index) => (
          <li key={index}>
            <NavLink
              to={path + subroute.path}
              className="link"
              style={navLinkStyle}
            >
              {subroute.title}
            </NavLink>
          </li>
        ))}
      </ul>
    );
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
          <NavLink
            to={
              user.role === "directeur" || user.role === "relex"
                ? ""
                : "/profile"
            }
            className="link"
            style={navLinkStyle}
          >
            <span
              style={{
                fontSize: "12px",
                color: "var(--black)",
                textTransform: "capitalize",
              }}
            >
              {user.nom + " " + user.prenom}
            </span>
          </NavLink>
        </div>
        {!responsive && (
          <ul className="sublist">
            {navData.map((title, index) => (
              <li key={index}>
                {title.subroutes ? (
                  <>
                    {" "}
                    <NavLink
                      to={title.path}
                      className="link"
                      style={navLinkStyle}
                    >
                      {title.title}
                    </NavLink>
                    <DropdownMenu
                      path={title.path}
                      title={title.title}
                      subroutes={title.subroutes}
                    />
                  </>
                ) : (
                  <NavLink
                    to={title.path}
                    className="link"
                    style={navLinkStyle}
                  >
                    {title.title}
                  </NavLink>
                )}
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
          <div className="notif-number">
            {notifications.filter((notif) => !notif.isRead).length}
          </div>
        </div>
        <button type="button" className="logoutBtn" onClick={handleLogout}>
          logout
        </button>
      </div>
    </div>
  );
};
export default NavBar;
