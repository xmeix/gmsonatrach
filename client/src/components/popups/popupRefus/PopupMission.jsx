const PopupMission = ({ item }) => {
  return (
    <div className="popup-mission">
      <div className="title">Mission Card</div>
      <div className="head">
        <h3>Object Mission: {item.objetMission}</h3>
        <div className="state">
          <p>
            <span>Etat:</span>{" "}
            <p
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
            </p>
          </p>
          <p>
            <span>Raison du refus:</span> {item.raisonRefus || "/"}
          </p>
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
            <p>
              <span>Date de debut mission:</span>
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.tDateDeb)
              )}
            </p>
            <p>
              <span>Date de fin mission:</span>
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(item.tDateRet)
              )}
            </p>
          </div>
          <div>
            <span>Structure:</span> {item.structure}
          </div>
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
          </p>
        </div>
      </div>

      <div className="employes">
        <span>Employes:</span>{" "}
        {item.employes.map((emp) => (
          <li className="employe">{emp.nom + " " + emp.prenom}</li>
        ))}
      </div>
      <div className="taches">
        <span>Taches:</span>{" "}
        {item.taches.map((tache) => (
          <div className="tache">
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
