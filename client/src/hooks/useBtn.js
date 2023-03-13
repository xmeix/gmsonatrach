import { useState } from "react";
import { useSelector } from "react-redux";
import { useAxios } from "./useAxios";

function useBtn() {
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
          if (type === "db" || type === "dm" || type === "dc")
            route = "/demande";
          else if (type === "rfm") route = "/rapportFM";
          else if (type === "mission") route = "/mission";
          callApi("patch", `${route}/${item._id}`, {
            etat: type === "rfm" ? "accepté" : "acceptée",
          });
        }
        break;
      case "refuse":
        {
          let route;
          if (
            type === "db" ||
            type === "dm" ||
            type === "dc" ||
            type === "demande"
          )
            route = "/demande";
          else if (type === "rfm") route = "/rapportFM";
          else if (type === "mission") route = "/mission";
          callApi("patch", `${route}/${item._id}`, {
            etat: type === "rfm" ? "refusé" : "refusée",
            raisonRefus: raison,
          });
        }
        break;
      case "cancel":
        {
          let route;
          if (type === "db" || type === "dm" || type === "dc")
            route = "/demande";
          else if (type === "mission") route = "/mission";
          callApi("patch", `${route}/${item._id}`, {
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
          if (type === "rfm") callApi("patch", `/rapportFM/${item.id}`, body);
        }
        break;
      case "send":
        {
          if (type === "rfm")
            callApi("patch", `/rapportFM/${item._id}`, {
              etat: "en-attente",
            });
        }
        break;
    }
  };  
  return [handleClick];
}

export default useBtn;
