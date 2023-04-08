import { useState } from "react";
import "./DashSettings.css";

const DashSettings = ({ handleButtonClick }) => {
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClickWithActive = (buttonId) => {
    setActiveButton(buttonId);
    handleButtonClick(buttonId);
  };

  return (
    <div className="dash-settings">
      <div className="dash-title">
        Basculer entre les vues quotidiennes, mensuelles et annuelles et adapter
        votre tableau de bord à vos besoins spécifiques.
      </div>
      <div className="chart-buttons">
        <button
          onClick={() => handleButtonClickWithActive(1)}
          className={`chart-btn ${activeButton === 1 ? "btn-active" : ""}`}
        >
          année
        </button>
        <button
          onClick={() => handleButtonClickWithActive(2)}
          className={`chart-btn ${activeButton === 2 ? "btn-active" : ""}`}
        >
          mois
        </button>
        <button
          onClick={() => handleButtonClickWithActive(3)}
          className={`chart-btn ${activeButton === 3 ? "btn-active" : ""}`}
        >
          jour
        </button>
      </div>
    </div>
  );
};

export default DashSettings;
