import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import { columnsRFM, filterRFMOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";

const RfmsList = () => {
  const { rfms } = useSelector((state) => state.rfms);

  return (
    <div className="gestion">
      <TableM
        title="Liste des rapports fin de mission"
        search={["id", "name"]}
        filterOptions={filterRFMOptions}
        columns={columnsRFM}
        data={rfms}
        colType="rfm"
      />
    </div>
  );
};

export default RfmsList;
