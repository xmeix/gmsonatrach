import { useState } from "react";
import useBtn from "../../../hooks/useBtn";
import "../Popup.css";
const PopupRefus = ({ type, item }) => {
  const [raison, setRaison] = useState("");
  const [handleClick] = useBtn();

  return (
    <div className="popup">
      <div className="title">Reason of Refusal</div>
      <textarea onChange={(e) => setRaison(e.target.value)} />
      <button onClick={() => handleClick("refuse", item, type, raison)}>
        refuse
      </button>
    </div>
  );
};

export default PopupRefus;
