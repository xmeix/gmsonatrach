import "./../../css/Gestion.css";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  MissionEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
import { useSelector } from "react-redux";
import { columnsMissions, filterMissionsOptions } from "../../data/tableCols";
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
  const missions = useSelector((state) => state.auth.missions);

  return (
    <div className="gestion">
      <PageName name="gestion Missions" />
      <div className="elements">
        <Formulaire
          type="mission"
          entries={entries}
          buttons={buttons}
          title="Add mission form"
        />
        <TableM
          title="Liste des missions"
          search={["id"]}
          filterOptions={filterMissionsOptions}
          columns={columnsMissions}
          data={missions}
          colType="mission"
        />
      </div>
    </div>
  );
};

export default GestionMission;
