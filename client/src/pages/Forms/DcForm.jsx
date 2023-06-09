import { useSelector } from "react-redux";
import Formulaire from "../../components/formulaire/Formulaire";
import { DCEntries, userButtons } from "../../data/formData";
import "./../../css/Gestion.css";

const DcForm = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="gestion">
      {user.role !== "directeur" && (
        <Formulaire
          type="DC"
          entries={DCEntries}
          buttons={userButtons}
          title="Formulaire de demande de congés"
        />
      )}
    </div>
  );
};

export default DcForm;
