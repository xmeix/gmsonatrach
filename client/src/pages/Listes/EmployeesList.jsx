import { useSelector } from "react-redux";
import TableM from "../../components/table/TableM";
import {
  columnsUsersEmp,
  filterResOptions,
  filterUserOptions,
} from "../../data/tableCols";
import "./../../css/Gestion.css";

const EmployeesList = () => {
  const { users, user } = useSelector((state) => state.auth);
  // const usersEmp = users.filter((user) => user.role !== "relex");
   return (
    <div className="gestion">
      <TableM
        title="Liste des employés ajoutés"
        filterOptions={
          user.role === "responsable" ? filterResOptions : filterUserOptions
        }
        columns={columnsUsersEmp}
        data={users}
        colType="user"
      />
    </div>
  );
};

export default EmployeesList;
