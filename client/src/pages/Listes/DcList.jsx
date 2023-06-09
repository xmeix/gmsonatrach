import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import { columnsDemandes, filterDemOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";
const DcList = () => {
  const demandes = useSelector((state) => state.auth.demandes);
  const demandesC = demandes.filter((dem) => dem.__t === "DC");

  return (
    <div className="gestion">
      <TableM
        title="Mes demandes de congés"
        search={["id", "name"]}
        data={demandesC}
        columns={columnsDemandes}
        filterOptions={filterDemOptions}
        colType="demande"
      />
    </div>
  );
};

export default DcList;
