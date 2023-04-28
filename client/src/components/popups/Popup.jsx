import { useState } from "react"; 
import "./Popup.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PopupRefus from "./popupRefus/PopupRefus";
import PopupUpdate from "./popupRefus/PopupUpdate";
import PopupMission from "./popupRefus/PopupMission";
import PopupUser from "./popupRefus/PopupUser";
import PopupDB from "./popupRefus/PopupDB";
import PopupDC from "./popupRefus/PopupDC"; 
import PopupDM from "./popupRefus/PopupDM";
import PopupOM from "./popupRefus/PopupOM";
import PopupSurvey from "./popupRefus/PopupSurvey";
const Popup = ({ item, type, isOpen, closePopup, popupType }) => {
  const [deroulement, setDeroulement] = useState([]);
  const [survey, setSurvey] = useState(false);
  console.log(survey);
  return (
    <div className={survey ? "popup-survey" : `popup popup-${popupType}`}>
      {!survey && <CloseRoundedIcon className="icon" onClick={closePopup} />}

      {!survey && popupType === "update" && (
        <PopupUpdate item={item} close={closePopup} setSurvey={setSurvey} />
      )}
      {survey && <PopupSurvey item={item} close={closePopup} />}
      {popupType === "refuse" && (
        <PopupRefus item={item} type={type} close={closePopup} />
      )}
      {popupType === "mission" && (
        <PopupMission item={item} close={closePopup} />
      )}
      {popupType === "om" && <PopupOM item={item} close={closePopup} />}
      {popupType === "user" && <PopupUser item={item} close={closePopup} />}
      {popupType === "db" && <PopupDB item={item} close={closePopup} />}
      {popupType === "dc" && <PopupDC item={item} close={closePopup} />}
      {popupType === "dm" && <PopupDM item={item} close={closePopup} />}
    </div>
  );
};

export default Popup;
