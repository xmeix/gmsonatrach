import Formulaire from "../../components/formulaire/Formulaire";
import { DMEntries, userButtons } from "../../data/formData";
import "./../../css/Gestion.css";

const DmForm = () => {
  return (
    <div className="gestion">
      <Formulaire
        type="DM"
        entries={DMEntries}
        buttons={userButtons}
        title="Formulaire de demande de modification"
      />
    </div>
  );
};

export default DmForm;
