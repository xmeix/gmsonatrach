import { Tooltip } from "@mui/material";
import "./DashCard.css";
const DashCard = ({ title, number, icon, formule }) => {
  return (
    <div className="dash-card">
      <Tooltip title={formule}>
        <span className="card-title">{title}</span>
      </Tooltip>
      <span className="number">{number}</span>
      {icon && (
        <icon
          className="card-icon"
          style={{ color: "rgba(185, 233, 185, 0.411)" }}
        />
      )}
    </div>
  );
};

export default DashCard;
