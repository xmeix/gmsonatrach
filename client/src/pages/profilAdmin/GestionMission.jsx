import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  MissionEntries as entries,
  missionButtons as buttons,
} from "../../data/formData";
import { useSelector } from "react-redux";
import {
  columnsMissions,
  columnsOM,
  columnsRFM,
  filterMissionsOptions,
  filterOMOptions,
  filterRFMOptions,
  filterResMissionsOptions,
} from "../../data/tableCols";
import UploadMissions from "./UploadMissions";

const GestionMission = () => {
  const { missions, user, rfms, oms } = useSelector((state) => state.auth);

  return (
    <div className="gestion">
      {/* <PageName name="gestion Missions" /> */}
      <div className="elements">
        {user.role === "employe" && (
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
          filterOptions={
            user.role === "responsable"
              ? filterResMissionsOptions
              : filterMissionsOptions
          }
          columns={columnsMissions}
          data={missions}
          colType="mission"
        />
        <TableM
          title="Ordres de mission des employés"
          search={["id"]}
          filterOptions={filterOMOptions}
          columns={columnsOM}
          data={oms}
          colType="om"
        />

        <div>
          {user.role !== "employe" && user.role !== "relex" && (
            <Formulaire
              type="mission"
              entries={entries}
              buttons={buttons}
              title="Formulaire d'ajout d'une mission"
            />
          )}
          {user.role !== "employe" && user.role !== "relex" && (
            <UploadMissions />
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionMission;
