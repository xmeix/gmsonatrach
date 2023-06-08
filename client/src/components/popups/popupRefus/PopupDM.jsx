import "../Popup.css";
import { OmLabelLine } from "./PopupOM";
const PopupDM = ({ item }) => {
  return (
    <>
      <div className="state">
        <div className="etat">
          <OmLabelLine
            label="Etat"
            content={<span className={`${item.etat}`}>{item.etat}</span>}
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
                (new Date(item.createdAt).toISOString().slice(0, 10) || "/")
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
