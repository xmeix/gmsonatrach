import "./../../css/Gestion.css";
import PageName from "../../components/pageName/PageName";
import TableM from "../../components/table/TableM";
import { useSelector } from "react-redux";
import {
  columnsDemandes,
  columnsRFM,
  filterDemOptions,
  filterRFMOptions,
} from "../../data/tableCols";
import Formulaire from "../../components/formulaire/Formulaire";
import { DCEntries, userButtons, userEntries } from "../../data/formData";
const GestionCMR = () => {
  const { demandes, rfms, user } = useSelector((state) => state.auth);
  const demandesCMR = demandes.filter(
    (dem) => dem.__t === "DM" || dem.__t === "DC"
  );

  return (
    <div className="gestion">
      {/* <PageName name="Congés et Rapports" /> */}
      <div className="elements">
        <TableM
          title="Liste des demandes"
          search={["id", "name"]}
          data={demandesCMR}
          columns={columnsDemandes}
          filterOptions={filterDemOptions}
          colType="demande"
        />
        <TableM
          title="Liste des rapports fin de mission"
          search={["id", "name"]}
          filterOptions={filterRFMOptions}
          columns={columnsRFM}
          data={rfms}
          colType="rfm"
        />
        {user.role !== "directeur" && (
          <Formulaire
            type="DC"
            entries={DCEntries}
            buttons={userButtons}
            title="Formulaire de demande de congés"
          />
        )}
      </div>
    </div>
  );
};

export default GestionCMR;
