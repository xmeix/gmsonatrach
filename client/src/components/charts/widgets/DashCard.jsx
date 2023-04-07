import "./DashCard.css";
const DashCard = ({ title, number }) => {
  return (
    <div className="dash-card">
      <span className="card-title">{title}</span>
      <span className="number">{number}</span>
      {/* <icon
        className="card-icon"
        style={{ color: "rgba(185, 233, 185, 0.411)" }}
      /> */}
    </div>
  );
};

export default DashCard;
