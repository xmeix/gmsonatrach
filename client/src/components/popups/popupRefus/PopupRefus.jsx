import { useState } from "react";
import useBtn from "../../../hooks/useBtn";
import "../Popup.css";
const PopupRefus = ({ type, item, close }) => {
  const [raison, setRaison] = useState("");
  const [handleClick] = useBtn();

  return (
    <div className="popup-refuse">
      <div className="pop-ref">
        {" "}
        <div className="title">Reason of Refusal</div>
        <textarea onChange={(e) => setRaison(e.target.value)} />
        <button
          onClick={() => {
            close();
            handleClick("refuse", item, type, raison);
          }}
        >
          refuse
        </button>
      </div>
    </div>
  );
};

export default PopupRefus;
