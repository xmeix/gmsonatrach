import { useSelector } from "react-redux";
import Formulaire from "../../components/formulaire/Formulaire";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import { DMEntries, userButtons } from "../../data/formData";
import { columnsDemandes, filterDemOptions } from "../../data/tableCols";

const GestionModification = () => {
  const demandes = useSelector((state) => state.auth.demandes);
  const demandesM = demandes.filter((dem) => dem.__t === "DM");

  const currentUser = useSelector((state) => state.auth.user);
  return (
    <div className="gestion">
      {/* <PageName name="modification" /> */}
      <div className="elements">
        <TableM
          title="Mes demandes de modification"
          search={["id", "name"]}
          data={demandesM}
          columns={columnsDemandes}
          filterOptions={filterDemOptions}
          colType="demande"
        />
        <Formulaire
          type="DM"
          entries={DMEntries}
          buttons={userButtons}
          title="Formulaire de demande de modification"
        />
      </div>
    </div>
  );
};

export default GestionModification;
