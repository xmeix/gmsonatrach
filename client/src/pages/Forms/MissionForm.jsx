import { useSelector } from "react-redux";
import {
  MissionEntries as entries,
  missionButtons as buttons,
} from "../../data/formData";
import Formulaire from "../../components/formulaire/Formulaire";
import "./../../css/Gestion.css";

const MissionForm = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="gestion">
      {user.role !== "employe" && user.role !== "relex" && (
        <Formulaire
          type="mission"
          entries={entries}
          buttons={buttons}
          title="Formulaire d'ajout d'une mission"
        />
      )}
    </div>
  );
};

export default MissionForm;
