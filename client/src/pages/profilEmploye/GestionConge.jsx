import { useSelector } from "react-redux";
import Formulaire from "../../components/formulaire/Formulaire";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import { DCEntries, userButtons } from "../../data/formData";
import { columnsDemandes, filterDemOptions } from "../../data/tableCols";
import "./../../css/Gestion.css";
const GestionConge = () => {
  const demandes = useSelector((state) => state.auth.demandes);
  const demandesC = demandes.filter((dem) => dem.__t === "DC");

  const currentUser = useSelector((state) => state.auth.user);
  return (
    <div className="gestion">
      <PageName name="Absence Requests" />
      <div className="elements">
        <Formulaire
          type="DC"
          entries={DCEntries}
          buttons={userButtons}
          title="request a leave of absence form"
        />

        <TableM
          title="Absence Requests List"
          search={["id", "name"]}
          data={demandesC}
          columns={columnsDemandes}
          filterOptions={filterDemOptions}
          colType="demande"
        />
      </div>
    </div>
  );
};

export default GestionConge;
