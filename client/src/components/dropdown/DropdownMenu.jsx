import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./DropdownMenu.css";
import { NotNavLinkStyle, navLinkStyle } from "../navbar/NavBar";

const DropdownMenu = ({ path, title, subroutes }) => {
  const [DMOpen, setDMOpen] = useState(false);

  const handleMouseEnter = () => {
    setDMOpen(true);
  };

  const handleMouseLeave = () => {
    setDMOpen(false);
  };

  return (
    <div
      className="dropdown-menu"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavLink to={path} className={`link a`} style={navLinkStyle}>
        {title}
      </NavLink>
      {DMOpen && (
        <ul className="menu-options">
          {subroutes.map((subroute, index) => (
            <li key={index}>
              <NavLink
                to={path + subroute.path}
                className={`link a`}
                style={index !== 0 ? navLinkStyle : NotNavLinkStyle}
              >
                {subroute.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
