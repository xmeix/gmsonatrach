import { dashTitles } from "../../data/navdata";
import { NavLink } from "react-router-dom";
import "./../charts/widgets/Settings.css";
const FloatingBar = () => {
  const navLinkStyle = ({ isActive }) => {
    return {
      backgroundColor: isActive ? "var(--gray)" : "transparent",
      color: isActive ? "var(--white)" : "var(--gray)",
    };
  };
 
  return (
    <ol className="setting-box">
      <div className="setting-box-title">choisir votre analyse</div>
      <div className="links">
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
      </div>
    </ol>
  );
};

export default FloatingBar;
