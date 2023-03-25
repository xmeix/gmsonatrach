import { useSelector } from "react-redux";
import logo from "../../../assets/logo.svg";
import usePDFGenerator from "../../../hooks/usePDFGenerator";
const PopupOM = ({ item }) => {
  const [pdfRef, generatePDF] = usePDFGenerator("ordre-mission");

  const {
    _id: missionId,
    lieuDep,
    destination,
    pays,
    tDateDeb,
    tDateRet,
    objetMission,
    moyenTransport,
  } = item.mission;
  const { _id: employeeId, nom, prenom, fonction } = item.employe;

  const OmLabelLine = ({ label, content }) => (
    <div className="om-label-line">
      <div className="om-label">{label}</div>
      <div className="om-content">{content}</div>
    </div>
  );
  const SignatureElement = ({ text }) => (
    <div className="om-signature-element">{text}</div>
  );
  return (
    <div className="popup-om" ref={pdfRef}>
      <div className="om-head">
        <div className="head-img">
          <img src={logo} alt="" className="logo" />
          <div className="om-direction">
            Direction Générale <br />
            La direction projet SH-ONE{" "}
          </div>
          <div className="om-identificateur">
            N° {missionId} /SH-ONE/
            {new Date(item.createdAt).toISOString().slice(0, 4)}
          </div>
        </div>
        <div className="official">
          <div className="head-off">
            République Algérienne Démocratique et Populaire
          </div>
          <div className="head-subOff">Ministère de l'Energie et des mines</div>
        </div>
      </div>
      <div className="title">Ordre de mission</div>
      <div className="om-body">
        <OmLabelLine label="Matricule" content={": " + employeeId} />
        <OmLabelLine label="Nom & Prénom" content={": " + `${nom} ${prenom}`} />
        <OmLabelLine label="Fonction" content={": " + fonction} />
        <OmLabelLine
          label="Parcours"
          content={
            ": " + `${lieuDep} Alger ${destination} ${pays} ${lieuDep} Alger`
          }
        />
        <OmLabelLine
          label="Objet de la mission"
          content={": " + objetMission}
        />
        <OmLabelLine
          label="Date de depart"
          content={": " + new Date(tDateDeb).toISOString().slice(0, 10)}
        />
        <OmLabelLine
          label="Date de retour"
          content={": " + new Date(tDateRet).toISOString().slice(0, 10)}
        />
        <OmLabelLine
          label="Moyen de transport"
          content={": " + moyenTransport.join("-")}
        />
      </div>
      <div className="om-signature">
        <SignatureElement text="Le Directeur" />
        <SignatureElement text="Le Responsable Intérimaire" />
        <SignatureElement text="A.FELFOUL" />
      </div>
      <hr />
      <div className="om-foot"></div>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default PopupOM;
