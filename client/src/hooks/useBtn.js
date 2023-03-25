import { useAxios } from "./useAxios";

const useBtn = () => {
  const { callApi } = useAxios();

  const handleClick = (btnType, item, type, raison, body) => {
    const { _id } = item;
    const route = getRoute(type);

    switch (btnType.toLowerCase()) {
      case "accept":
        const etatAccept = type === "rfm" ? "accepté" : "acceptée";
        callApi("patch", `${route}/${_id}`, { etat: etatAccept });
        break;
      case "refuse":
        let b = {};
        if (type === "rfm") {
          b = {
            etat: "créé",
            raisonRefus: raison || "",
            nbRefus: item.nbRefus + 1,
          };
        } else
          b = {
            etat: "refusée",
            raisonRefus: raison || "",
          };

        callApi("patch", `${route}/${_id}`, b);
        break;
      case "cancel":
        callApi("patch", `${route}/${_id}`, { etat: "annulée" });
        break;
      case "delete":
        // do something
        break;
      case "update":
        callApi("patch", `${route}/${_id}`, { deroulement: body });

        break;
      case "send":
        callApi("patch", `${route}/${_id}`, { etat: "en-attente" });
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
      case "dm":
        return "/demande";
      case "db":
        return "/demande";
      case "dc":
        return "/demande";
      default:
        return "/";
    }
  };

  return [handleClick];
};

export default useBtn;
