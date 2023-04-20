import { useState } from "react";
import "./Settings.css";
const DashSettings = ({ handleButtonClick }) => {
  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClickWithActive = (buttonId) => {
    setActiveButton(buttonId);
    handleButtonClick(buttonId);
  };

  return (
    <div className="setting-box ">
      <div className="setting-box-title">choisir votre vue</div>

      <div className="chart-buttons">
        <button
          onClick={() => handleButtonClickWithActive(1)}
          className={`chart-btn ${activeButton === 1 ? "btn-active" : ""}`}
        >
          annuelle
        </button>
        <button
          onClick={() => handleButtonClickWithActive(2)}
          className={`chart-btn ${activeButton === 2 ? "btn-active" : ""}`}
        >
          mensuelle
        </button>
        <button
          onClick={() => handleButtonClickWithActive(3)}
          className={`chart-btn ${activeButton === 3 ? "btn-active" : ""}`}
        >
          quotidienne
        </button>
      </div>
    </div>
  );
};

export default DashSettings;
