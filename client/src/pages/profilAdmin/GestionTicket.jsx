import { useSelector } from "react-redux";
import "./../../css/Gestion.css";
import AddTicketForm from "../../components/addTicketForm/AddTicketForm";

const GestionTicket = () => {
  const { user, missions } = useSelector((state) => state.auth);

  const currentUserHasMission = () => {
    if (!user || !missions) {
      return false; // Return false if user or missions are not available
    }

    // Check if any mission has employe with matching _id and etat === "en-cours"
    return missions.some(
      (mission) =>
        mission.employes.some((employe) => employe._id === user._id) &&
        mission.etat === "en-cours"
    );
  };

  if (!currentUserHasMission()) {
    return (
      <div className="noc-missions">
        <div className="noc-message">Vous n'avez pas de mission en cours</div>
      </div>
    );
  } else
    return (
      <div className="gestion">
        <AddTicketForm />
      </div>
    );
};

export default GestionTicket;
