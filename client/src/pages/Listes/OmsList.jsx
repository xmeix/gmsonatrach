import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import { columnsOM, filterOMOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";

const OmsList = () => {
  const { oms } = useSelector((state) => state.oms);

  return (
    <div className="gestion">
      <TableM
        title="Ordres de mission des employés"
        search={["id"]}
        filterOptions={filterOMOptions}
        columns={columnsOM}
        data={oms}
        colType="om"
      />
    </div>
  );
};

export default OmsList;
