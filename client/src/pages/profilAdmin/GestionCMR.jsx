import "./../../css/Gestion.css";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import { useSelector } from "react-redux";
const GestionCMR = () => {
  const filterOptions = ["etat", "DB", "DM", "DC"];

  
  return (
    <div className="gestion">
      <PageName name="gestion CMR" />
      <div className="elements">
        <TableM
          title="Requests List"
          search={["id", "name"]}
         />

        <TableM
          title="Liste des rapports fin de mission"
          search={["id", "name"]}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
};

export default GestionCMR;
