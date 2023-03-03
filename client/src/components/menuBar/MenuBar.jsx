import { NavLink } from "react-router-dom";
import "./MenuBar.css";
const MenuBar = ({ titles }) => {
  return (
    <ul className="menuBar">
      {titles.map((title, i) => (
        <li key={i}>
          <NavLink to={title.path} className="link a">
            {title.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default MenuBar;
