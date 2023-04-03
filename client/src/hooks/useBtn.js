import { useAxios } from "./useAxios";

const useBtn = () => {
  const { callApi } = useAxios();

  const handleClick = (btnType, item, type, raison, body) => {
    const { _id } = item;
    const route = getRoute(type);

    console.log("inside handleClick " + _id + " " + route);
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
        callApi("delete", `${route}/${_id}`);
        break;
      case "update":
        callApi("patch", `${route}/${_id}`, { deroulement: body });
        break;
      case "send":
        callApi("patch", `${route}/${_id}`, { etat: "en-attente" });
        break;

      case "check":
        console.log("check patch " + route + "/" + _id + " " + body);
        callApi("patch", `${route}/${_id}`, {
          taches: body,
        });
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
      case "user":
        return "/auth/user";
      default:
        return "/";
    }
  };

  return [handleClick];
};

export default useBtn;
