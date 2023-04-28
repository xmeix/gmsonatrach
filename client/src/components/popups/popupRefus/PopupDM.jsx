import "../Popup.css";
import { OmLabelLine } from "./PopupOM";
const PopupDM = ({ item }) => {
  return (
    <>
      <div className="state">
        <div className="etat">
          <OmLabelLine
            label="Etat"
            content={
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
            }
          />
        </div>
        <OmLabelLine
          label="Raison de refus: "
          content={
            <span style={{ whiteSpace: "initial" }}>
              {item.raisonRefus || "/"}
            </span>
          }
        />
      </div>
      <div className="popup-dm">
        <div className="content">
          <div className="title">Demande de modification</div>
          <div className="om-body"></div>
          <div className="om-body" style={{ whiteSpace: "initial" }}>
            <OmLabelLine
              label="Créé par"
              content={
                ": " + item.idEmetteur.nom + " " + item.idEmetteur.prenom
              }
            />
            <OmLabelLine
              label="Le"
              content={
                ": " +
                (Intl.DateTimeFormat(["ban", "id"]).format(
                  new Date(item.createdAt)
                ) || "/")
              }
            />
            <OmLabelLine label="Motif" content={": " + (item.motif || "/")} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupDM;
