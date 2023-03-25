import logo from "../../../assets/logo.svg";
import usePDFGenerator from "../../../hooks/usePDFGenerator";

const PopupDB = ({ item }) => {
  const {
    _id,
    createdAt,
    numSC,
    designationSC,
    montantEngage,
    nature,
    depart,
    destination,
    employes,
    dateDepart,
    dateRetour,
    direction,
    sousSection,
    division,
    base,
    gisement,
    observation,
    motifDep,
  } = item;
  const [pdfRef, generatePDF] = usePDFGenerator("Fiche-suiveuse");

  return (
    <div className="popup-db" ref={pdfRef}>
      <div className="db-tab">
        <div className="db-row">
          <div className="db-cell">
            <img
              src={logo}
              alt=""
              className="logo-image"
              style={{ height: "70px", width: "60px", flex: 1 }}
            />
          </div>
          <div className="db-cell">
            <div className="titre">Fiche Suiveuse</div>
            <div>Budget Exploitation</div>
          </div>
          <div className="db-cell">
            <div>
              <span>Ordre</span> ....
            </div>
            <div>
              <span>N°</span> {_id}/{new Date(createdAt).getFullYear()}
            </div>
            <div>
              <span>Date:</span> {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="db-row">
          <div className="db-cell" style={{ flex: 1 }}>
            Référence budgétaire
          </div>
          <div className="db-cell" style={{ flex: 2 }}>
            <div>
              <span>N° sous compte:</span> {numSC}
            </div>
            <div>
              <span>Désignation sous compte:</span> {designationSC}
            </div>
            <div>
              <span>Montant engagé:</span> {montantEngage} DA
            </div>
          </div>
        </div>
      </div>

      <div className="db-body">
        <div>
          <span>Nature:</span>{" "}
          {nature === "aller-retour"
            ? `${depart} / ${destination} / ${depart}`
            : `${depart} / ${destination}`}
          au profit de:
          <span>
            <br />
            <br />- {employes.length} personnes
          </span>
        </div>
        <div className="db-date">
          <span>
            Départ: {new Date(dateDepart).toLocaleDateString()} à{" "}
            {new Date(dateDepart).toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <span>
            Retour: {new Date(dateRetour).toLocaleDateString()} à{" "}
            {new Date(dateRetour).toLocaleTimeString([], {
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
          <div className="db-cell">{direction || "projet SH-ONE"}</div>
          <div className="db-cell">{sousSection || "/"}</div>
          <div className="db-cell">{division || "/"}</div>{" "}
          <div className="db-cell">{base || "/"}</div>{" "}
          <div className="db-cell">{gisement || "/"}</div>{" "}
        </div>
      </div>
      <div className="db-body">
        <span>Observations:</span>
        {observation}
        <span>Motif du déplacement: </span>
        {"mission de " + motifDep}
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
        {new Date(dateDepart).toLocaleDateString()} au{" "}
        {new Date(dateRetour).toLocaleDateString()}
      </div>
      <div className="db-subtitle">
        BC N° /{direction || "SH-ONE"}/{new Date(createdAt).getFullYear()}
      </div>
      <div className="db-tab">
        <div className="db-row">
          <div className="db-cell"></div>
          <div className="db-cell">Nom & Prénom:</div>
          <div className="db-cell">Départ </div>
          <div className="db-cell">Retour </div>
        </div>
        {employes.map((emp, i) => (
          <div className="db-row" key={i}>
            <div className="db-cell">{i}</div>
            <div className="db-cell">{emp.nom + " " + emp.prenom}</div>
            <div className="db-cell">
              {new Date(dateDepart).toLocaleDateString()}
            </div>
            <div className="db-cell">
              {new Date(dateRetour).toLocaleDateString()}
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
