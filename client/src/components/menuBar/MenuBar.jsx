import { NavLink } from "react-router-dom";
import "./MenuBar.css";
const MenuBar = ({ titles }) => {
  return (
    <ul className="menuBar">
      {titles.map((title, index) => (
        <li key={index} className="first-level">
          {title.subroutes ? (
            <>
              {" "}
              <NavLink to={title.path} className="l1">
                {title.title}
              </NavLink>
              <ul className="second-level">
                {title.subroutes.map((subroute, index) => (
                  <NavLink key={index} to={title.path + subroute.path}>
                    <li>{subroute.title}</li>{" "}
                  </NavLink>
                ))}
              </ul>
            </>
          ) : (
            <NavLink to={title.path} className=" l1">
              {title.title}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MenuBar;
