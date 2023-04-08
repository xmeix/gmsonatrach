import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/Menu";
import MenuBar from "../menuBar/MenuBar";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import { titles, employeTitles, relexTitles } from "../../data/navdata";
import { useAxios } from "../../hooks/useAxios";
const NavBar = () => {
  const navLinkStyle = ({ isActive }) => {
    return {
      color: isActive ? "var(--orange)" : "var(--black)",
      fontWeight: isActive ? "700" : "600",
    };
  };
  const [isOpen, setIsOpen] = useState(false);
  const [responsive, setResponsive] = useState(false);
  const { callApi } = useAxios();

  const user = useSelector((state) => state.auth.user);
  const [navData] = useState(() => {
    switch (user?.role) {
      case "directeur":
      case "secretaire":
      case "responsable":
        return titles;
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
        return "Director Account";
        break;
      case "responsable":
        return "sub Director Account";
        break;
      case "secretaire":
        return "Secretaire Account";
        break;
      case "relex":
        return "Relex Account";
        break;
      case "employe":
        return "Employe Account";
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
    console.log(innerWidth);
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
      <div className="list">
        {isOpen && (
          <CloseRoundedIcon className="icon" onClick={handleHideMenu} />
        )}
        {isOpen && <MenuBar titles={navData} />}
        {!isOpen && responsive && (
          <MenuRoundedIcon className="icon" onClick={handleMenu} />
        )}
        {isOpen && <div className="hideDiv" onClick={handleHideMenu}></div>}
        <div className="profileTitle">{profileTitle}</div>
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
      <button type="button" className="logoutBtn" onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};
export default NavBar;
