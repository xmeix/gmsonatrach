 import PageName from "../../components/pageName/PageName";
import "./../../css/Gestion.css";
import TableM from "../../components/table/TableM";
import Formulaire from "../../components/formulaire/Formulaire";
import {
  userEntries as entries,
  userButtons as buttons,
 } from "../../data/formData";
import { useSelector } from "react-redux";
import { columnsUsersEmp, filterUserOptions } from "../../data/tableCols";
const GestionEmploye = () => {
  const users = useSelector((state) => state.auth.users);
  const usersEmp = users.filter((user) => user.role !== "relex");

  return (
    <div className="gestion">
      <PageName name="gestion Employés" />
      <div className="elements">
        <Formulaire
          type="user"
          entries={entries}
          buttons={buttons}
          title="Add user form"
        />
        <TableM
          title="Employees List"
          filterOptions={filterUserOptions}
          columns={columnsUsersEmp}
          data={usersEmp}
          colType="user"
        />
      </div>
    </div>
  );
};

export default GestionEmploye;
