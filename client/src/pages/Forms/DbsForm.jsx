import { useSelector } from "react-redux";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  DBEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
import "./../../css/Gestion.css";

const DbsForm = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="gestion">
      {user.role !== "relex" && (
        <Formulaire
          type="DB"
          entries={entries}
          buttons={buttons}
          title="Formulaire de demande de billetterie"
        />
      )}
    </div>
  );
};

export default DbsForm;
