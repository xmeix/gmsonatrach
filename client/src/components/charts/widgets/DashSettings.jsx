import "./DashSettings.css";
const DashSettings = ({ handleButtonClick }) => {
  return (
    <div className="dash-settings">
      <div className="dash-title">
        Basculer entre les vues quotidiennes, mensuelles et annuelles et adapter
        votre tableau de bord à vos besoins spécifiques.
      </div>
      <div className="chart-buttons">
        <button onClick={() => handleButtonClick(1)} className="chart-btn">
          année
        </button>
        <button onClick={() => handleButtonClick(2)} className="chart-btn">
          mois
        </button>
        <button onClick={() => handleButtonClick(3)} className="chart-btn">
          jour
        </button>
      </div>
    </div>
  );
};

export default DashSettings;
