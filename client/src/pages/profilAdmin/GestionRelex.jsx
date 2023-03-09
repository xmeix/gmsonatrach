import Input from "../../components/form/input/Input";
import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  DBEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
import { useSelector } from "react-redux";
import {
  columnsDemandes,
  filterDBOptions,
  filterDemOptions,
} from "../../data/tableCols";
const GestionRelex = () => {
  const demandes = useSelector((state) => state.auth.demandes);
  const demandesDB = demandes.filter((dem) => dem.__t === "DB");
  return (
    <div className="gestion">
      <PageName name="gestion RELEX" />
      <div className="elements">
        <Formulaire
          type="DB"
          entries={entries}
          buttons={buttons}
          title="Ticket Request Form"
        />
        <TableM
          title="Liste des demandes de billetterie"
          search={["id"]}
          filterOptions={filterDBOptions}
          columns={columnsDemandes}
          data={demandesDB}
          colType="demande"
        />
      </div>
    </div>
  );
};

export default GestionRelex;
