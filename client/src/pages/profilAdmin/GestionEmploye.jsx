import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  userEntries as entries,
  userButtons as buttons,
} from "../../data/formData";
import { useSelector } from "react-redux";
import {
  columnsUsersEmp,
  filterResOptions,
  filterUserOptions,
} from "../../data/tableCols";
import UploadUsers from "./UploadUsers";
const GestionEmploye = () => {
  const { users, user } = useSelector((state) => state.auth);
  const usersEmp = users.filter((user) => user.role !== "relex");

  return (
    <div className="gestion">
      {/* <PageName name="gestion Employés" /> */}
      <div className="elements">
        <TableM
          title="Liste des employés ajoutés"
          filterOptions={
            user.role === "responsable" ? filterResOptions : filterUserOptions
          }
          columns={columnsUsersEmp}
          data={usersEmp}
          colType="user"
        />
        <Formulaire
          type="user"
          entries={entries}
          buttons={buttons}
          title="Formulaire d'ajout d'utilisateur"
        />
        <UploadUsers />
      </div>
    </div>
  );
};

export default GestionEmploye;
