import "../Popup.css";
const PopupDM = ({ item }) => {
  return (
    <div className="popup-dm">
      <div className="content">
        <div className="title">Demande de modification</div>
        <div>
          <span>Etat:</span>
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
        <div className="div">
          <p>
            <span>Créé par: </span>
            {item.idEmetteur.nom + " " + item.idEmetteur.prenom}
          </p>
          <p>
            <span>Le: </span>
            {Intl.DateTimeFormat(["ban", "id"]).format(
              new Date(item.createdAt)
            )}
          </p>
          <p>
            <span>Motif:</span> {item.motif}
          </p>
          <p>
            <span>Raison de refus:</span> {item.raisonRefus || "/"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PopupDM;
