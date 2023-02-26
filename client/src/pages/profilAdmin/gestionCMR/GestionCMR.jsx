import "./../../../css/Gestion.css";
import Liste from "./../../../components/liste/Liste";
import PageName from "../../../components/pageName/PageName";
const GestionCMR = () => {
  const filterOptions = ["etat"];
  return (
    <div className="gestion">
      <PageName name="gestion CMR" />
      <div className="elements">
        <div className="listeG">
          <Liste
            title="Liste des demandes de congés"
            search={["id", "name"]}
            filterOptions={filterOptions}
          />
        </div>
        <div className="listeG">
          <Liste
            title="Liste des demandes de modification"
            search={["id", "name"]}
            filterOptions={filterOptions}
          />
        </div>
        <div className="listeG">
          <Liste
            title="Liste des rapports fin de mission"
            search={["id", "name"]}
            filterOptions={filterOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default GestionCMR;
