import Formulaire from "../../components/formulaire/Formulaire";
import {
  userEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
import "./../../css/Gestion.css";

const EmployeesForm = () => {
  return (
    <div className="gestion">
      <Formulaire
        type="user"
        entries={entries}
        buttons={buttons}
        title="Formulaire d'ajout d'utilisateur"
      />
    </div>
  );
};

export default EmployeesForm;
