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
import { userButtons, userEntries } from "../../data/formData";
const GestionCMR = () => {
  const demandes = useSelector((state) => state.auth.demandes);
  const demandesCMR = demandes.filter(
    (dem) => dem.__t === "DM" || dem.__t === "DC"
  );

  const rfms = useSelector((state) => state.auth.rfms);
  const currentUser = useSelector((state) => state.auth.user);
  return (
    <div className="gestion">
      <PageName name="Leave and reports" />
      <div className="elements">
        <TableM
          title="Requests List"
          search={["id", "name"]}
          data={demandesCMR}
          columns={columnsDemandes}
          filterOptions={filterDemOptions}
          colType="demande"
        />
        <TableM
          title="List of end-of-mission reports"
          search={["id", "name"]}
          filterOptions={filterRFMOptions}
          columns={columnsRFM}
          data={rfms}
          colType="rfm"
        />
      </div>
    </div>
  );
};

export default GestionCMR;