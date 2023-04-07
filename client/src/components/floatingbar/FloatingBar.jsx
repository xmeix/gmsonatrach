import { dashTitles } from "../../data/navdata";
import { NavLink } from "react-router-dom";
import "./FloatingBar.css";
const FloatingBar = () => {
  return (
    <ol className="floating-bar">
      {dashTitles.map((title, i) => (
        <NavLink to={title.path} className="link" key={title.id}>
          <li className="link">{title.title}</li>
        </NavLink>
      ))}
    </ol>
  );
};

export default FloatingBar;
