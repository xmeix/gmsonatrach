import "./../../css/Gestion.css";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  MissionEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
import { useSelector } from "react-redux";
import {
  columnsMissions,
  columnsOM,
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
  const oms = useSelector((state) => state.auth.oms);

  return (
    <div className="gestion">
      {/* <PageName name="gestion Missions" /> */}
      <div className="elements">
        {currentUser.role !== "employe" && currentUser.role !== "relex" && (
          <Formulaire
            type="mission"
            entries={entries}
            buttons={buttons}
            title="Formulaire d'ajout d'une mission"
          />
        )}

        {currentUser.role === "employe" && (
          <TableM
            title="Liste de rapports de fin de mission"
            search={["id", "name"]}
            filterOptions={filterRFMOptions}
            columns={columnsRFM}
            data={rfms}
            colType="rfm"
          />
        )}

        <TableM
          title="Listes des missions de travail"
          search={["id"]}
          filterOptions={filterMissionsOptions}
          columns={columnsMissions}
          data={missions}
          colType="mission"
        />
        <TableM
          title="Ordres de mission des employés"
          search={["id"]}
          filterOptions={filterMissionsOptions}
          columns={columnsOM}
          data={oms}
          colType="om"
        />
      </div>
    </div>
  );
};

export default GestionMission;
