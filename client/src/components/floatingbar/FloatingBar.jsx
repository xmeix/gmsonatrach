import { dashTitles } from "../../data/navdata";
import { NavLink } from "react-router-dom";
import "./FloatingBar.css";
const FloatingBar = () => {
  return (
    <ol className="floating-bar">
      {dashTitles.map((title, i) => (
        <li key={title.id}>
          <NavLink to={title.path} className="link">
            {title.title}
          </NavLink>
        </li>
      ))}
    </ol>
  );
};

export default FloatingBar;
