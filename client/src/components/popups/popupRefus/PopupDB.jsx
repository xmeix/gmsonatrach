import "./../Popup.css";
import logo from "../../../assets/logo.svg";
const PopupDB = ({ item }) => {
  return (
    <div className="popup-db">
      <div className="db-head">
        <div className="db-container">
          <img
            src={logo}
            alt=""
            className="logo-image"
            style={{
              height: "70px",
              width: "60px",
              flex: 1,
            }}
          />
          <div className="db-head-half" style={{ flex: 1 }}>
            <div className="titre">Fiche Suiveuse</div>
            <div>Budget Exploitation</div>
          </div>
          <div className="db-head-info" style={{ flex: 1 }}>
            <div>
              <span>Ordre</span> ....
            </div>
            <div>
              <span>N°</span> {item._id}/
              {new Date(item.createdAt).getFullYear()}
            </div>
            <div>
              <span>Date:</span> {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="db-container">
          <div style={{ flex: 1 }}>Référence budgétaire</div>
          <div className="db-head-info" style={{ flex: 2 }}>
            <div>
              <span>N° sous compte:</span> {item.numSC}
            </div>
            <div>
              <span>Désignation sous compte:</span> {item.designationSC}
            </div>
            <div>
              <span>Montant engagé:</span> {item.montantEngage} DA
            </div>
          </div>
        </div>
      </div>
      <div className="db-body">
        <div>
          <span>Nature:</span>
          {item.nature} sur le parcours :{" "}
          {item.nature === "aller-retour"
            ? item.depart + " / " + item.destination + " / " + item.depart + " "
            : item.depart + " / " + item.destination + " "}
          au profit de:
          <span>
            <br />
            <br />- {item.employes.length} personnes
          </span>
        </div>
        <div className="db-date">
          <span>
            Départ:
            {new Date(item.dateDepart).toLocaleDateString()}à{" "}
            {new Date(item.dateRetour).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <span>
            Retour:
            {new Date(item.dateRetour).toLocaleDateString()}à{" "}
            {new Date(item.dateRetour).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      <div className="db-tab">
        <div className="db-row">
          <div className="db-cell">direction</div>
          <div className="db-cell">Service section Sous - section</div>
          <div className="db-cell">division</div>
          <div className="db-cell">base</div>
          <div className="db-cell">gisement</div>
        </div>
        <div className="db-row">
          <div className="db-cell">{item.direction || "projet SH-ONE"}</div>
          <div className="db-cell">{item.sousSection || "/"}</div>
          <div className="db-cell">{item.division || "/"}</div>{" "}
          <div className="db-cell">{item.base || "/"}</div>{" "}
          <div className="db-cell">{item.gisement || "/"}</div>{" "}
        </div>
      </div>
      <div className="db-body">
        <span>Observations:</span>
        {item.observation}
        <span>Motif du déplacement: </span>
        {"mission de " + item.motifDep}
      </div>
      <div className="db-tab">
        <div className="db-row">
          <div className="db-cell" style={{ textAlign: "left" }}>
            <p>Date de création:</p> <br />
            <br />
            <p>Visa de l'ordonnateur:</p>
          </div>
          <div className="db-cell" style={{ textAlign: "left" }}>
            <p>Service du Budget </p>
            <br /> <br />
            <p>Controlé le</p>
            <br /> <br />
            <p>Visa</p>
          </div>
        </div>
      </div>
      <div className="db-subtitle">Partie réservée à la Trésorerie</div>
      <div className="db-tab">
        <div className="db-row">
          <div className="db-cell">No De la facture: </div>
          <div className="db-cell">+dépassement: </div>
        </div>
        <div className="db-row">
          <div className="db-cell">Montant engagé:</div>
          <div className="db-cell">-insuffisance</div>
        </div>
      </div>
      <div className="db-subtitle">Règlements</div>
      <div className="db-tab">
        <div className="db-row">
          <div className="db-cell">Date:</div>
          <div className="db-cell">Acomptes </div>
          <div className="db-cell">Solde </div>
          <div className="db-cell">observations</div>
        </div>
        <div className="db-row">
          <div className="db-cell"> </div>
          <div className="db-cell"> </div>
          <div className="db-cell"> </div>
          <div className="db-cell"> </div>
        </div>
        <div className="db-row">
          <div className="db-cell"> </div>
          <div className="db-cell"> </div>
          <div className="db-cell"> </div>
          <div className="db-cell"> </div>
        </div>
      </div>
      <div className="db-subtitle">
        La liste nominative des missionnaires du{" "}
        {new Date(item.dateDepart).toLocaleDateString()} au{" "}
        {new Date(item.dateRetour).toLocaleDateString()}
      </div>
      <div className="db-subtitle">
        BC N° /{item.direction || "SH-ONE"}/
        {new Date(item.createdAt).getFullYear()}
      </div>
      <div className="db-tab">
        <div className="db-row">
          <div className="db-cell"></div>
          <div className="db-cell">Nom & Prénom:</div>
          <div className="db-cell">Départ </div>
          <div className="db-cell">Retour </div>
        </div>
        {item.employes.map((emp, i) => (
          <div className="db-row" key={i}>
            <div className="db-cell">{i}</div>
            <div className="db-cell">{emp.nom + " " + emp.prenom}</div>
            <div className="db-cell">
              {new Date(item.dateDepart).toLocaleDateString()}
            </div>
            <div className="db-cell">
              {new Date(item.dateRetour).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      <div className="db-subtitle">
        Le Directeur projet SH One <br /> A.FELFOUL{" "}
      </div>
    </div>
  );
};

export default PopupDB;
