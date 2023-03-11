import { useState } from "react";
import { useSelector } from "react-redux";
import { useAxios } from "./useAxios";

function useBtn() {
  const [popupType, setPopupType] = useState(null); //OM CARD ,USER CARD,MISSION CARD, DB,DC,DM CARD
  const user = useSelector((state) => state.auth.user);
  const { callApi } = useAxios();

  const handleClick = (btnType, item, type, raison, body) => {
    console.log(
      "request:" + btnType + " " + item + " " + type + " " + raison + " " + body
    );

    switch (btnType.toLowerCase()) {
      case "accept":
        {
          //call the api that changes the state of item
          let route;
          if (type === "demande") route = "/demande";
          else if (type === "rfm") route = "/rapportFM";
          else if (type === "mission") route = "/mission";
          callApi("patch", `${route}/${item.id}`, {
            etat: type === "rfm" ? "accepté" : "acceptée",
          });
        }
        break;
      case "refuse":
        {
          let route;
          if (type === "demande") route = "/demande";
          else if (type === "rfm") route = "/rapportFM";
          else if (type === "mission") route = "/mission";
          callApi("patch", `${route}/${item.id}`, {
            etat: type === "rfm" ? "refusé" : "refusée",
            raisonRefus: raison,
          });
        }
        break;
      case "cancel":
        {
          if (type === "mission")
            callApi("patch", `/mission/${item.id}`, {
              etat: "annulée",
            });
        }
        break;
      case "delete":
        {
        }
        break;
      case "update":
        {
        }
        break;
      case "send":
        {
          if (type === "rfm")
            callApi("patch", `/rapportFM/${item.id}`, {
              etat: "en-attente",
            });
        }
        break;
    }
  };
  const handleShow = (showType) => {
    setPopupType(showType);
    console.log(showType);
  };
  const handleClose = () => {
    setPopupType(null);
  };
  return [handleClose, handleShow, popupType, handleClick];
}

export default useBtn;
