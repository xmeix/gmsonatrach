import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import { columnsRFM, filterRFMOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";

const RfmsList = () => {
  const { rfms } = useSelector((state) => state.rfms);
  const notCreatedRfms = rfms.filter((e) => e.etat !== "créé");
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="gestion">
      <TableM
        title="Liste des rapports fin de mission"
        search={["id", "name"]}
        filterOptions={filterRFMOptions}
        columns={columnsRFM}
        data={
          user.role === "directeur" || user.role === "responsable"
            ? notCreatedRfms
            : rfms
        }
        colType="rfm"
      />
    </div>
  );
};

export default RfmsList;
