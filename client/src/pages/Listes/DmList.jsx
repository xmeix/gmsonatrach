import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import { columnsDemandes, filterDemOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";

const DmList = () => {
  const {demandes} = useSelector((state) => state.demande);
  const demandesM = demandes.filter((dem) => dem.__t === "DM");

  return (
    <div className="gestion">
      <TableM
        title="Mes demandes de modification"
        search={["id", "name"]}
        data={demandesM}
        columns={columnsDemandes}
        filterOptions={filterDemOptions}
        colType="demande"
      />
    </div>
  );
};

export default DmList;
