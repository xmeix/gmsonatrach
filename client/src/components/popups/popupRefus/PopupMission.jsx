const PopupMission = ({ item }) => {
  return (
    <div className="popup-mission">
      <div className="title">Information mission</div>
      <div className="head">
        <h3>Object Mission: {item.objetMission}</h3>
        <div className="state">
          <div>
            <span>Etat:</span>{" "}
            <span
              style={{
                color:
                  item.etat === "en-attente"
                    ? "var(--orange)"
                    : item.etat === "acceptée"
                    ? "var(--success)"
                    : "var(--error)",
                fontWeight: "600",
              }}
            >
              {item.etat}
            </span>
          </div>
          <div>
            <span>Raison du refus:</span> {item.raisonRefus || "/"}
          </div>
          {/* {item.etat === "refusée" && (
          <div>
            <span>Raison du refus:</span> {item.raisonRefus}
          </div>
        )} */}
        </div>
      </div>
      <div className="info">
        <div className="info-mission">
          <div className="dates">
            <div>
              <span>Date de debut mission:</span>
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.tDateDeb)
              )}
            </div>
            <div>
              <span>Date de fin mission:</span>
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.tDateRet)
              )}
            </div>
          </div>
          <div>
            <span>Structure:</span> {item.structure}
          </div>
          <div>
            <span>Type:</span> {item.type}
          </div>
          <div>
            <span>Observation:</span> {item.observation || "/"}
          </div>
        </div>
        <div className="info-budget">
          <div>
            <span>Budget: </span>
            {item.budget}
          </div>
          <div>
            <span>Budget Consomme:</span>{" "}
            {item.budgetConsome === 0 ? (
              <input
                type="number"
                style={{
                  width: "100px",
                  height: "10px",
                }}
                min={0}
              />
            ) : (
              item.budgetConsome
            )}
          </div>
        </div>
      </div>

      <div className="employes">
        <span>Employes:</span>{" "}
        {item.employes.map((emp, i) => (
          <li className="employe" key={i}>
            {emp.nom + " " + emp.prenom}
          </li>
        ))}
      </div>
      <div className="taches">
        <span>Taches:</span>{" "}
        {item.taches.map((tache, i) => (
          <div className="tache" key={i}>
            <div className="content">{tache.content}</div>
            <div
              className="etat"
              style={{
                color:
                  tache.state === "non-accomplie"
                    ? "var(--error)"
                    : "var(--success)",
                fontWeight: "600",
                fontSize: "12px",
              }}
            >
              {tache.state}
            </div>
            <button>fait</button>
          </div>
        ))}
      </div>

      <div className="deplacement">
        <div>
          <span>Pays:</span> {item.pays}
        </div>
        <div>
          <span>Moyen de transport aller:</span>{" "}
          {item.moyenTransport.join(" - ")}
        </div>
        <div>
          <span>Moyen de transport retour:</span>{" "}
          {item.moyenTransportRet.join(" - ")}
        </div>
        <div>
          <span>Lieu de depart:</span> {item.lieuDep}
        </div>
        <div>
          <span>Destination:</span> {item.destination}
        </div>
        <div>
          <span>Circonscription Administrative:</span>{" "}
          {item.circonscriptionAdm || " /"}
        </div>
      </div>

      <div className="info-creation">
        <div className="crea-container">
          <div>
            <span>Créé le:</span>{" "}
            {Intl.DateTimeFormat(["ban", "id"]).format(
              new Date(item.createdAt)
            )}
          </div>
          <div>
            <span>par: </span>{" "}
            {item.createdBy.nom + " " + item.createdBy.prenom}
          </div>
        </div>

        <div className="crea-container">
          <div>
            <span>Dernière modification le:</span>{" "}
            {Intl.DateTimeFormat(["ban", "id"]).format(
              new Date(item.updatedAt)
            )}
          </div>
          <div>
            <span> par:</span>
            {item.updatedBy.nom + " " + item.updatedBy.prenom}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupMission;
