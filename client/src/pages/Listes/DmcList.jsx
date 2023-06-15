import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import { columnsDemandes, filterDemOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";

const DmcList = () => {
  const { demandes } = useSelector((state) => state.demande);
  const demandesCMR = demandes.filter(
    (dem) => dem.__t === "DM" || dem.__t === "DC"
  );
  return (
    <div className="gestion">
      <TableM
        title="Liste des demandes"
        search={["id", "name"]}
        data={demandesCMR}
        columns={columnsDemandes}
        filterOptions={filterDemOptions}
        colType="demande"
      />
    </div>
  );
};

export default DmcList;
