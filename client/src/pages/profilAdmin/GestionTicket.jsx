import { useSelector } from "react-redux";
import "./../../css/Gestion.css";
import AddTicketForm from "../../components/addTicketForm/AddTicketForm";
import Ticket from "../../components/ticket/Ticket";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useState } from "react";
const GestionTicket = () => {
  const { user, missions } = useSelector((state) => state.auth);
  const [isFormVisible, setIsFormVisible] = useState(false);

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
  const handleFormToggle = () => {
    setIsFormVisible((prevValue) => !prevValue);
  };
  if (!currentUserHasMission()) {
    return (
      <div className="noc-missions">
        <div className="noc-message">Vous n'avez pas de mission en cours</div>
      </div>
    );
  } else
    return (
      <div className="gestion flex">
        <AddRoundedIcon
          onClick={handleFormToggle}
          className="icon addTicketIcon"
        />
        {isFormVisible && <AddTicketForm />}
        <div className="tickets">
          <Ticket
            objet={"objet"}
            description={
              "Qui eu laborum do mollit. Enim Lorem cupidatat voluptate sunt au occaecat ut labore. Mollit exercitation magna qui aute pariatur tempor est sint in mollit eiusmod. Irure reprehenderit ipsum ut eiusmod eu quistempor labore magna consequat enim dolor veniam sint Consequatincididunt qui consectetur excepteur aliqua ad ullamco veniam non.Excepteur do dolor pariatur est id labore sunt."
            }
            createdBy={"nom prénom"}
            createdAt={new Date().getTime()}
            isSolved={true}
          />
          <Ticket
            objet={"objet"}
            description={
              "Qui eu laborum do mollit. Enim Lorem cupidatat voluptate sunt au occaecat ut labore. Mollit exercitation magna qui aute pariatur tempor est sint in mollit eiusmod. Irure reprehenderit ipsum ut eiusmod eu quistempor labore magna consequat enim dolor veniam sint Consequatincididunt qui consectetur excepteur aliqua ad ullamco veniam non.Excepteur do dolor pariatur est id labore sunt."
            }
            createdBy={"nom prénom"}
            createdAt={new Date().getTime()}
            isSolved={true}
          />
          <Ticket
            objet={"objet"}
            description={
              "Qui eu laborum do mollit. Enim Lorem cupidatat voluptate sunt au occaecat ut labore. Mollit exercitation magna qui aute pariatur tempor est sint in mollit eiusmod. Irure reprehenderit ipsum ut eiusmod eu quistempor labore magna consequat enim dolor veniam sint Consequatincididunt qui consectetur excepteur aliqua ad ullamco veniam non.Excepteur do dolor pariatur est id labore sunt."
            }
            createdBy={"nom prénom"}
            createdAt={new Date().getTime()}
            isSolved={false}
          />
        </div>
      </div>
    );
};

export default GestionTicket;
