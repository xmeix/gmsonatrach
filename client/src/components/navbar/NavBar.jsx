import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/Menu";
import MenuBar from "../menuBar/MenuBar";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
const NavBar = () => {
  const titles = [
    { id: 1, title: "Planification", path: "/planification" },
    { id: 2, title: "Gestion Des Mission", path: "/gestion-des-mission" },
    { id: 3, title: "Gestion Des Employes", path: "/gestion-des-employes" },
    { id: 4, title: "Gestion Service Relex", path: "/gestion-service-relex" },
    { id: 5, title: "Gestion C/M/RFM", path: "/gestion-c-m-rfm" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [responsive, setResponsive] = useState(false);

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
      if (getWindowSize().innerWidth <= 951) {
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
  return (
    <div className="navbar">
      <div className="list">
        {isOpen && (
          <CloseRoundedIcon className="icon" onClick={handleHideMenu} />
        )}
        {isOpen && <MenuBar titles={titles} />}
        {!isOpen && responsive && (
          <MenuRoundedIcon className="icon" onClick={handleMenu} />
        )}
        {isOpen && <div className="hideDiv" onClick={handleHideMenu}></div>}
        {!responsive && (
          <NavLink to="" className="tb" exact>
            Tableau de bord
          </NavLink>
        )}
        {!responsive && (
          <ul className="sublist">
            {titles.map((title, i) => (
              <li key={title.id}>
                <NavLink to={title.path} className="link" exact>
                  {title.title}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
      <NavLink to="/login" className="logout">
        <button type="button"> logout </button>
      </NavLink>
    </div>
  );
};
export default NavBar;
