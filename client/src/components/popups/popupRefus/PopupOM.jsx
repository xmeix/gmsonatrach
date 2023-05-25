import { useSelector } from "react-redux";
import logo from "../../../assets/logo.svg";
import useFileGenerator from "../../../hooks/useFileGenerator";
export const OmLabelLine = ({ label, content }) => (
  <div className="om-label-line">
    <div className="om-label">{label}</div>
    <div className="om-content">{content}</div>
  </div>
);
const PopupOM = ({ item }) => {
  const {
    uid: missionId,
    lieuDep,
    destination,
    pays,
    tDateDeb,
    tDateRet,
    objetMission,
    moyenTransport,
  } = item.mission;
  const { uid: employeeId, nom, prenom, fonction } = item.employe;
  const FileItem = {
    date: new Date(tDateRet).toISOString().slice(0, 10),
    year: new Date(item.createdAt).toISOString().slice(0, 4),
    _id: item.uid,
    missionid: missionId,
    id: employeeId,
    nom,
    prenom,
    fonction,
    parcours:
      lieuDep +
      " Algérie " +
      destination +
      " " +
      pays +
      " " +
      lieuDep +
      " Algérie ",
    objetMission,
    datedepart: new Date(tDateDeb).toISOString().slice(0, 10),
    dateretour: new Date(tDateRet).toISOString().slice(0, 10),
    moyenTransport: moyenTransport.join("-"),
  };
  const [generateDocument] = useFileGenerator(
    FileItem,
    "/my-template-OM.docx",
    `OrdreMission-${missionId}.docx`
  );
  const SignatureElement = ({ text }) => (
    <div className="om-signature-element">{text}</div>
  );
  return (
    <>
      <div className="popup-om">
        <div className="om-head">
          <div className="head-img">
            <img src={logo} alt="" className="logo" />
            <div className="om-direction">
              Direction Générale <br />
              La direction projet SH-ONE{" "}
            </div>
            <div className="om-identificateur">
              N° {item.uid} /SH-ONE/
              {FileItem.date}
            </div>
          </div>
          <div className="official">
            <div className="head-off">
              République Algérienne Démocratique et Populaire
            </div>
            <div className="head-subOff">
              Ministère de l'Energie et des mines
            </div>
          </div>
        </div>
        <div className="title">Ordre de mission</div>
        <div className="om-body">
          <OmLabelLine label="Matricule" content={": " + employeeId} />
          <OmLabelLine
            label="Nom & Prénom"
            content={": " + `${nom} ${prenom}`}
          />
          <OmLabelLine label="Fonction" content={": " + fonction} />
          <OmLabelLine label="Parcours" content={": " + FileItem.parcours} />
          <OmLabelLine
            label="Objet de la mission"
            content={": " + objetMission}
          />
          <OmLabelLine
            label="Date de depart"
            content={": " + FileItem.datedepart}
          />
          <OmLabelLine
            label="Date de retour"
            content={": " + FileItem.dateretour}
          />
          <OmLabelLine
            label="Moyen de transport"
            content={": " + FileItem.moyenTransport}
          />
        </div>
        <div className="om-signature">
          <SignatureElement text="Le Directeur" />
          <SignatureElement text="Le Responsable Intérimaire" />
          <SignatureElement text="A.FELFOUL" />
        </div>
        <hr />
        <div className="om-foot"></div>
      </div>
      <button onClick={generateDocument}>Generate PDF</button>
    </>
  );
};

export default PopupOM;
