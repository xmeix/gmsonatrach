import Input from "../../components/form/input/Input";
import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";

const GestionEmploye = () => {
  const filterOptions = ["state"];

  const entries = [
    { label: "Nom", type: "text", width: "80%" },
    { label: "Prénom", type: "text", width: "80%" },
    { label: "Fonction", type: "text", width: "80%" },
    { label: "Date de naissance", type: "date", width: "80%" },
    { label: "Lieu de naissance", type: "text", width: "80%" },
    { label: "Adresse", type: "text", width: "80%" },

    { label: "Numéro de téléphone", type: "tel", width: "80%" },
    { label: "Email", type: "email", width: "80%" },
    { label: "Mot de passe", type: "password", width: "80%" },
  ];

  return (
    <div className="gestion">
      <PageName name="gestion Employés" />
      <div className="elements">
        <div className="form">
          <div className="formTitle">Formulaire d'ajout d'employé</div>
          <div className="inputs">
            <div className="inside">
              {entries.map((entry, i) => {
                return (
                  <div key={i}>
                    <Input
                      label={entry.label}
                      type={entry.type}
                      width={entry.width}
                    />
                    {i % 3 !== 0 && i !== 7 && <div className="line" />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="buttons">
            <button className="btn" onClick={""}>
              Annuler
            </button>
            <button className="btn" onClick={""}>
              Ajouter
            </button>
          </div>
        </div>
        <TableM
          title="Liste des employés"
          search={["id", "name"]}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default GestionEmploye;
