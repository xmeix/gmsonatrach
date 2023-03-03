import Input from "../../components/form/input/Input";
import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";
const GestionRelex = () => {
  const filterOptions = ["etat"];
  const entries = [
    {
      label: "Numéro Sous Compte",
      type: "number",
      width: "80%",
    },
    {
      label: "Désignation Sous Compte",
      type: "text",
      width: "80%",
    },
    {
      label: "Motif déplacement",
      type: "text",
      width: "80%",
    },
    {
      label: "Montant engagé",
      type: "number",
      width: "80%",
    },
    {
      label: "Nature demande",
      type: "text",
      width: "80%",
    },

    {
      label: "Observation",
      type: "text",
      width: "80%",
    },
    {
      label: "Date de départ",
      type: "date",
      width: "80%",
    },
    {
      label: "Date de retour",
      type: "date",
      width: "80%",
    },
  ];
  return (
    <div className="gestion">
      <PageName name="gestion RELEX" />
      <div className="elements">
        <div className="form">
          <div className="formTitle">
            Formulaire d'Envoi demande de billetterie
          </div>
          <div className="inputs">
            <div className="inside">
              {entries.map((entry, i) => {
                return (
                  <>
                    <Input
                      key={i}
                      label={entry.label}
                      type={entry.type}
                      width={entry.width}
                    />
                    {i % 3 !== 0 && <div className="line" />}
                  </>
                );
              })}
            </div>
            <div className="outside">
              <label className="label">Motif</label>
              <textarea
                className="subinput"
                style={{ marginTop: "1em" }}
                cols={35}
                rows={10}
              />
            </div>
          </div>
          <div className="buttons">
            <button className="btn" onClick={""}>
              Annuler
            </button>
            <button className="btn" onClick={""}>
              Envoyer
            </button>
          </div>
        </div>
        <TableM
          title="Liste des demandes de billetterie"
          search={["id"]}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default GestionRelex;
