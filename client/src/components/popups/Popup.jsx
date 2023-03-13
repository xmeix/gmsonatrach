import { useState } from "react";
import { useSelector } from "react-redux";
import useBtn from "../../hooks/useBtn";
import "./Popup.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PopupRefus from "./popupRefus/PopupRefus";
import PopupUpdate from "./popupRefus/PopupUpdate";
const Popup = ({ item, type, isOpen, closePopup, popupType }) => {
  const [deroulement, setDeroulement] = useState([]);

  return (
    <div className={`popup popup-${popupType}`}>
      <CloseRoundedIcon className="icon" onClick={closePopup} />
      {popupType === "update" && <PopupUpdate item={item} />}
      {popupType === "refuse" && <PopupRefus item={item} type={type} />}
    </div>
  );
};

export default Popup;
