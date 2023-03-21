import { useSelector } from "react-redux";
import { useAxios } from "./useAxios";

const useBtn = () => {
   const { callApi } = useAxios();

  const handleClick = (btnType, item, type, raison, body) => {
    console.log(raison)
    const { _id, nbRefus } = item;
    const route = getRoute(type);

    switch (btnType.toLowerCase()) {
      case "accept":
        const etatAccept = type === "rfm" ? "accepté" : "acceptée";
        callApi("patch", `${route}/${_id}`, { etat: etatAccept });
        break;
      case "refuse":
        const etatRefuse = type === "rfm" ? "créé" : "refusée";
        const nbRefusIncremented = nbRefus + 1;
        callApi("patch", `${route}/${_id}`, {
          etat: etatRefuse,
          raisonRefus: raison || "",
          nbRefus: nbRefusIncremented,
        });
        break;
      case "cancel":
        callApi("patch", `${route}/${_id}`, { etat: "annulée" });
        break;
      case "delete":
        // do something
        break;
      case "update":
        if (type === "rfm") {
          callApi("patch", `/rapportFM/${_id}`, { deroulement: body });
        }
        break;
      case "send":
        if (type === "rfm")
          callApi("patch", `/rapportFM/${_id}`, { etat: "en-attente" });
        break;
      default:
        break;
    }
  };

  const getRoute = (type) => {
    switch (type) {
      case "rfm":
        return "/rapportFM";
      case "mission":
        return "/mission";
      default:
        return "/demande";
    }
  };

  return [handleClick];
};

export default useBtn;
