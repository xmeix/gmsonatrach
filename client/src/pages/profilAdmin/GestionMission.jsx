import "./../../css/Gestion.css";
import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Input from "../../components/form/input/Input";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  MissionEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid var(--light-gray)",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1);",
    "&:hover": {
      border: "1px solid var(--light-gray)",
    },
    "&:focus": {
      border: "1px solid var(--light-gray)",
    },
  }),
};

const GestionMission = () => {
  const [visibility, setVisibility] = useState(1);

  const filterOptions = ["etat", "moyen de transport"];

  const changeVisibility = () => {
    setVisibility(visibility + 1);
    console.log(visibility);
  };
  const AddMission = () => {
    setVisibility(1);
  };

  const Predire = () => {
    console.log("prediction");
  };
  return (
    <div className="gestion">
      <PageName name="gestion Missions" />
      <div className="elements">
        <Formulaire
          type="user"
          entries={entries}
          buttons={buttons}
          title="Add user form"
        />
        <TableM
          title="Liste des missions"
          search={["id"]}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default GestionMission;
