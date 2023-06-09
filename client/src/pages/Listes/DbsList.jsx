import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import { columnsDemandes, filterDBOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";

const DbsList = () => {
  const demandes = useSelector((state) => state.auth.demandes);
  const demandesDB = demandes.filter((dem) => dem.__t === "DB");

  return (
    <div className="gestion">
      <TableM
        title="Liste de demandes de billetterie"
        search={["id"]}
        filterOptions={filterDBOptions}
        columns={columnsDemandes}
        data={demandesDB}
        colType="demande"
      />
    </div>
  );
};

export default DbsList;
