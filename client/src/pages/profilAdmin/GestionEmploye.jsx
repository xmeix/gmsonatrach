import Input from "../../components/form/input/Input";
import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  userEntries as entries,
  userButtons as buttons,
  userEntries,
} from "../../data/formData";
const GestionEmploye = () => {
  const filterOptions = ["state"];

  return (
    <div className="gestion">
      <PageName name="gestion Employés" />
      <div className="elements">
        <Formulaire
          type="user"
          entries={entries}
          buttons={buttons}
          title="Add user form"
        />
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
