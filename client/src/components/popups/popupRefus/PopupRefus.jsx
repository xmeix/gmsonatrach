import { useState } from "react";
import useBtn from "../../../hooks/useBtn";
import "../Popup.css";
const PopupRefus = ({ type, item, close }) => {
  const [raison, setRaison] = useState("");
  const [handleClick] = useBtn();
  console.log("raison=" + raison);
  return (
    <div className="popup-refuse">
      <div className="pop-ref">
        {" "}
        <div className="title">Veuillez spécifier la raison du refus</div>
        <textarea rows={5} onChange={(e) => setRaison(e.target.value)} />
        <button
          onClick={() => {
            handleClick("refuse", item, type, raison, {});

            close();
          }}
        >
          refuser
        </button>
      </div>
    </div>
  );
};

export default PopupRefus;
