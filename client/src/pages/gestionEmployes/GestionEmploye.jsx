import Liste from "../../components/liste/Liste";
import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
const GestionEmploye = () => {
  const filterOptions = ["state"];

  return (
    <div className="gestion">
      <PageName name="gestion Employés" />
      <div className="elements">
        <div className="form"></div>
        <div className="listeG">
          <Liste
            title="Liste des employés"
            search={["id", "name"]}
            filterOptions={filterOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default GestionEmploye;
