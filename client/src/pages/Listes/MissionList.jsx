import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import {
  columnsMissions,
  filterMissionsOptions,
  filterResMissionsOptions,
} from "../../data/tableCols";
import "./../../css/Gestion.css";

const MissionList = () => {
  const { user } = useSelector((state) => state.auth);
  const { missions } = useSelector((state) => state.mission);
  

  return (
    <div className="gestion">
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
    </div>
  );
};

export default MissionList;
