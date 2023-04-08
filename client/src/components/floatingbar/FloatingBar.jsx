import { dashTitles } from "../../data/navdata";
import { NavLink } from "react-router-dom";
import "./FloatingBar.css";
const FloatingBar = () => {
  const navLinkStyle = ({ isActive }) => {
    return {
      boxShadow: isActive
        ? "0px 1px 4px 0px rgba(0, 0, 0, 0.22)"
        : "0px 1px 4px 0px rgba(180, 176, 176, 0.22)",
    };
  };
  return (
    <ol className="floating-bar">
      {dashTitles.map((title, i) => (
        <NavLink
          to={title.path}
          className="link"
          key={title.id}
          style={navLinkStyle}
        >
          {title.title}
        </NavLink>
      ))}
    </ol>
  );
};

export default FloatingBar;
