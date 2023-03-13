import "./../../css/Gestion.css";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import { MissionEntries, userButtons as buttons } from "../../data/formData";
import { useSelector } from "react-redux";
import {
  columnsMissions,
  columnsRFM,
  filterMissionsOptions,
  filterRFMOptions,
} from "../../data/tableCols";
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
  const users = useSelector((state) => state.auth.users);
  const currentUser = useSelector((state) => state.auth.user);
  const rfms = useSelector((state) => state.auth.rfms);

  const employeesNonMissionnaires = users
    .filter(
      (user) => user.role === "employe" && user.etat === "non-missionnaire"
    )
    .map((user) => ({ label: user.nom + " " + user.prenom, value: user._id }));

  const entries = MissionEntries.map((entry) => {
    if (entry.id === "employes") entry.options = employeesNonMissionnaires;
    return entry;
  });
  return (
    <div className="gestion">
      <PageName name="gestion Missions" />
      <div className="elements">
        {currentUser.role !== "employe" && currentUser.role !== "relex" && (
          <Formulaire
            type="mission"
            entries={entries}
            buttons={buttons}
            title="Add mission form"
          />
        )}

        {currentUser.role === "employe" && (
          <TableM
            title="List of end-of-mission reports"
            search={["id", "name"]}
            filterOptions={filterRFMOptions}
            columns={columnsRFM}
            data={rfms}
            colType="rfm"
          />
        )}

        <TableM
          title="Business travels list"
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
