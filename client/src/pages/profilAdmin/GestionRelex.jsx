import Input from "../../components/form/input/Input";
import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  userEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
const GestionRelex = () => {
  const filterOptions = ["etat"];

  return (
    <div className="gestion">
      <PageName name="gestion RELEX" />
      <div className="elements">
        <Formulaire
          type="DB"
          entries={entries}
          buttons={buttons}
          title="Add user form"
        />
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
