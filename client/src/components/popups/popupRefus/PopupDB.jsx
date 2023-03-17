const PopupDB = ({ item }) => {
  return (
    <div className="popup-db">
      <p>Numéro sous compte: {item.numSC || "/"}</p>
      <p>Designation SC: {item.designationSC || "/"}</p>
      <p>Montant Engage: {item.montantEngage || "/"}</p>
      <p>Nature: {item.nature || "/"}</p>
      <p>Motif Dep: {item.motifDep || "/"}</p>
      <p>Observation: {item.observation || "/"}</p>
      <p>Date Depart: {item.dateDepart || "/"}</p>
      <p>Date Retour: {item.dateRetour || "/"}</p>

      <input type="text" />
    </div>
  );
};

export default PopupDB;
