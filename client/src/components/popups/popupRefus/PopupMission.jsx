const PopupMission = ({ item }) => {
  return (
    <div className="popup-mission">
      <div className="title">Mission Card</div>
      <div className="head">
        <h3>Object Mission: {item.objetMission}</h3>{" "}
        <div className="state">
          <p>
            <span>Etat:</span> {item.etat}
          </p>
          <p>
            <span>Raison du refus:</span> {item.raisonRefus}
          </p>{" "}
          {/* {item.etat === "refusée" && (
          <p>
            <span>Raison du refus:</span> {item.raisonRefus}
          </p>
        )} */}
        </div>
      </div>
      <div className="info">
        <div className="info-mission">
          <div className="dates">
            {" "}
            <p>
              <span>Date de debut mission:</span> {item.tDateDeb}
            </p>
            <p>
              <span>Date de fin mission:</span> {item.tDateRet}
            </p>
          </div>
          <p>
            <span>Structure:</span> {item.structure}
          </p>
          <p>
            <span>Type:</span> {item.type}
          </p>
          <p>
            <span>Observation:</span> {item.observation || "/"}
          </p>
        </div>
        <div className="info-budget">
          <p>
            <span>Budget: </span>
            {item.budget}
          </p>
          <p>
            <span>Budget Consomme:</span> {item.budgetConsome}
          </p>
        </div>
      </div>

      <div className="employes">
        <span>Employes:</span> {item.employes.map((emp) => emp.nom).join(", ")}
      </div>
      <div className="taches">
        <span>Taches:</span>{" "}
        {item.taches.map((tache) => tache.content).join(", ")}
      </div>

      <div className="deplacement">
        <p>
          <span>Pays:</span> {item.pays}
        </p>
        <p>
          <span>Moyen de transport aller:</span>{" "}
          {item.moyenTransport.join(" - ")}
        </p>
        <p>
          <span>Moyen de transport retour:</span>{" "}
          {item.moyenTransportRet.join(" - ")}
        </p>
        <p>
          <span>Lieu de depart:</span> {item.lieuDep}
        </p>
        <p>
          <span>Destination:</span> {item.destination}
        </p>
        <p>
          <span>Circonscription Administrative:</span>{" "}
          {item.circonscriptionAdm || " /"}
        </p>
      </div>

      <div className="info-creation">
        <div className="crea-container">
          <span>Créé le:</span> {item.createdAt} <span>par: </span>{" "}
          {item.createdBy.nom + " " + item.createdBy.prenom}
        </div>

        <div className="crea-container">
          <span>Dernière modification le:</span> {item.createdAt}{" "}
          <span> par:</span> {item.updatedBy.nom + " " + item.updatedBy.prenom}
        </div>
      </div>
    </div>
  );
};

export default PopupMission;
