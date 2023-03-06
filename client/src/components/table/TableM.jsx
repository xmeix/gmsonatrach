import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./TableM.css";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TablePagination,
  InputAdornment,
} from "@material-ui/core";
import { useSelector } from "react-redux";

const columns = [
  { id: "createdAt", label: "date", minWidth: "20px" },
  { id: "idEmetteur", label: "Sender", minWidth: "20px" },
  { id: "motif", label: "Motif", minWidth: "20px" },
  { id: "etat", label: "State", minWidth: "20px" },
];

const filterOptions = [
  "en-attente",
  "acceptée",
  "refusée",
  "annulée",
  "DB",
  "DM",
  "DC",
];

const TableM = ({ title }) => {
  const data = useSelector((state) => state.auth.demandes);
  const users = useSelector((state) => state.auth.users);

  const [filter, setFilter] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState({
    column: "id",
    direction: "asc",
  });

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
    setPage(0);
  };

  const getUserName = (id) => {
    const user = users.find((u) => u._id === id);
    if (user) {
      return user.nom + " " + user.prenom;
    }
    return "";
  };

  const filteredData = useMemo(() => {
    const hasFilter = filter || filterOption;
    if (!hasFilter) {
      return data;
    }
    return data.filter((item) => {
      let result = true;
      if (filter) {
        result = columns.some((column) => {
          if (!item[column.id]) {
            return false;
          }
          const cellValue =
            item[column.id].toString().toLowerCase() ||
            item[column.id].nom.toString().toLowerCase() ||
            item[column.id].prenom.toString().toLowerCase();
          const filterValue = filter.toLowerCase();
          return (
            cellValue.includes(filterValue) ||
            (column.id === "idEmetteur" &&
              (item[column.id].nom
                .toString()
                .toLowerCase()
                .includes(filterValue) ||
                item[column.id].prenom
                  .toString()
                  .toLowerCase()
                  .includes(filterValue)))
          );
        });
      }
      if (filterOption) {
        result =
          result &&
          (item.__t.toString() === filterOption.toString() ||
            item.etat.toString() === filterOption.toString());
      }
      return result;
    });
  }, [data, filter, filterOption]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  // const sortedData = useMemo(() => {
  //   const sorted = data.sort((a, b) => {
  //     const column = sortOrder.column;
  //     const direction = sortOrder.direction === "asc" ? 1 : -1;
  //     if (a[column] < b[column]) {
  //       return -1 * direction;
  //     } else if (a[column] > b[column]) {
  //       return 1 * direction;
  //     } else {
  //       return 0;
  //     }
  //   });
  //   return sorted;
  // }, [data, sortOrder]);
  const handleSort = (columnId) => {
    const isAsc =
      sortOrder.column === columnId && sortOrder.direction === "asc";
    setSortOrder({ column: columnId, direction: isAsc ? "desc" : "asc" });
  };
  return (
    <div className="table">
      <p className="listTitle">{title ? title : "list"}</p>
      <form className="control">
        <div style={{ position: "relative" }}>
          <InputAdornment
            position="start"
            style={{ position: "absolute", top: "0.9em", left: "0.5em" }}
          >
            <SearchRoundedIcon className="searchIcon" />
          </InputAdornment>
          <input
            className="search"
            placeholder="search for ..."
            label="Search"
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
        <select
          value={filterOption}
          onChange={(event) => handleFilterOptionChange(event)}
        >
          <option value="">All</option>
          {filterOptions.map((opt, i) => {
            return (
              <option key={i} value={opt}>
                {opt}
              </option>
            );
          })}
        </select>
      </form>

      <TableContainer
        component={Paper}
        style={{ width: "80vw" }}
        aria-label="simple table"
      >
        <Table className="tableContainer" stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell className="tableRow" key={column.id} align="center">
                  {column.label}
                </TableCell>
              ))}
              <TableCell className="tableRow" align="center">
                Configuration
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="center" className="tableColumn">
                  {format(new Date(item.createdAt), "dd/mm/yy")}
                </TableCell>
                <TableCell align="center" className="tableColumn">
                  {item.idEmetteur.nom + " " + item.idEmetteur.prenom}
                </TableCell>
                <TableCell align="center" className="tableColumn">
                  {item.motif}
                </TableCell>
                <TableCell align="center" className="tableColumn">
                  {item.etat}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="pagination"
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default TableM;
