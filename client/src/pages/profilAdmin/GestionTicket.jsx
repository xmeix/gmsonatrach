import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import "./../../css/Gestion.css";
import AddTicketForm from "../../components/addTicketForm/AddTicketForm";
import Ticket from "../../components/ticket/Ticket";
import { getTickets } from "../../api/apiCalls/getCalls";
import { socket } from "../../App";

const GestionTicket = () => {
  const { user, missions, tickets, isLoggedIn } = useSelector(
    (state) => state.auth
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const dispatch = useDispatch();

  const currentUserHasMission =useCallback( () => {
    if (!user || !missions) {
      return false; // Return false if user or missions are not available
    }

    // Check if any mission has employe with matching _id and etat === "en-cours"
    return missions.some(
      (mission) =>
        mission.employes.some((employe) => employe._id === user._id) &&
        mission.etat === "en-cours"
    );
  },[missions]);

  const handleFormToggle = () => {
    setIsFormVisible((prevValue) => !prevValue);
  };

  if (!currentUserHasMission()) {
    return (
      <div className="noc-missions">
        <div className="noc-message">Vous n'avez pas de mission en cours</div>
      </div>
    );
  } else {
    // Sort tickets by createdAt in descending order
    const sortedTickets = tickets
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <div className="gestion">
        {isFormVisible && (
          <div
            className="hideUnder"
            onClick={() => setIsFormVisible(false)}
          ></div>
        )}
        <AddRoundedIcon
          onClick={handleFormToggle}
          className="icon addTicketIcon"
        />
        {isFormVisible && <AddTicketForm />}
        {sortedTickets.length > 0 ? (
          <div className="tickets">
            {sortedTickets.map((tick, i) => (
              <Ticket
                key={i}
                id={tick._id}
                objet={tick.object}
                description={tick.description}
                createdBy={tick.employe}
                createdAt={new Date(tick.createdAt).getTime()}
                isSolved={tick.isSolved}
                commentaires={tick.commentaires || []}
              />
            ))}
          </div>
        ) : (
          <div className="noc-missions">
            <div className="noc-message">Pas de tickets disponibles</div>
          </div>
        )}
      </div>
    );
  }
};

export default GestionTicket;
