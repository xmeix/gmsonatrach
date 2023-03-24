import { useSelector } from "react-redux";
import logo from "../../../assets/logo.svg";
const PopupOM = ({ item }) => {
  const oms = useSelector((state) => state.auth.oms);
  const om = oms.filter((o) => o.mission.id === item.id).map((o) => o);
  console.log(om);
  return (
    <div className="popup-om">
      <div className="om-head">
        <div className="head-img">
          <img src={logo} alt="" className="logo" />
          <div className="om-direction">
            Direction Générale <br />
            La direction projet SH-ONE{" "}
          </div>
          <div className="om-identificateur">N° /SH-ONE/2021</div>
        </div>
        <div className="official">
          <div className="head-off">
            République Algérienne Démocratique et Populaire
          </div>
          <div className="head-subOff">Ministère de l'Energie et des mines</div>
        </div>
      </div>
      <div className="om-title">Ordre de mission</div>
      <div className="om-body">
        <div className="om-label-line">
          <div className="om-label">Matricule</div>
          <div className="om-content"></div>
        </div>
        <div className="om-label-line">
          <div className="om-label">Nom & Prénom</div>
          <div className="om-content"></div>
        </div>
        <div className="om-label-line">
          <div className="om-label">Fonction</div>
          <div className="om-content"></div>
        </div>
        <div className="om-label-line">
          <div className="om-label">Parcours</div>
          <div className="om-content"></div>
        </div>
        <div className="om-label-line">
          <div className="om-label">Objet de la mission</div>
          <div className="om-content"></div>
        </div>
        <div className="om-label-line">
          <div className="om-label">Date de depart</div>
          <div className="om-content"></div>
        </div>
        <div className="om-label-line">
          <div className="om-label">Date de retour</div>
          <div className="om-content"></div>
        </div>
        <div className="om-label-line">
          <div className="om-label">Moyen de transport</div>
          <div className="om-content"></div>
        </div>
      </div>
      <div className="om-signature">
        <div className="om-signature-element">Le Directeur</div>
        <div className="om-signature-element">Le Responsable Intérimaire</div>
        <div className="om-signature-element">A.FELFOUL</div>
      </div>
      <div className="om-foot"></div>
    </div>
  );
};

export default PopupOM;
