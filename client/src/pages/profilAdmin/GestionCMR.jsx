import "./../../css/Gestion.css";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
const GestionCMR = () => {
  const filterOptions = ["etat"];
  return (
    <div className="gestion">
      <PageName name="gestion CMR" />
      <div className="elements">
        <TableM
          title="Liste des demandes de congés"
          search={["id", "name"]}
          filterOptions={filterOptions}
        />

        <TableM
          title="Liste des demandes de modification"
          search={["id", "name"]}
          filterOptions={filterOptions}
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
