import { useState, useRef, useEffect } from "react";
import useChartButtons from "../../../hooks/useChartButtons";
import useFile, { filesConfig } from "../../../hooks/useFile";
import FloatingBar from "../../floatingbar/FloatingBar";
import DashSettings from "./DashSettings";
import "./Settings.css";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

const Settings = ({ handleButtonClick, handleFileChange, file }) => {
  const [showSettings, setShowSettings] = useState(false);
  const handleIconClick = () => {
    setShowSettings(!showSettings);
  };

  return (
    <>
      {showSettings && (
        <div className="settings">
          <div className="settings-container">
            <FloatingBar />
            <DashSettings handleButtonClick={handleButtonClick} />
            {file && (
              <div className="setting-box">
                <div className="setting-box-title">choisir votre fichier</div>
                <select
                  value={file.fileName}
                  onChange={(event) => handleFileChange(event)}
                >
                  {filesConfig.map((opt, i) => {
                    return (
                      <option key={i} value={opt.fileName}>
                        {opt.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
      <TuneRoundedIcon className="seticon icon" onClick={handleIconClick} />
    </>
  );
};

export default Settings;
