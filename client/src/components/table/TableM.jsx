import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./TableM.css";
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

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "title", label: "Title", minWidth: 150 },
  { id: "completed", label: "Completed", minWidth: 200 },
];

const TableM = ({ title }) => {
  const [filter, setFilter] = useState("");
  const [completedFilter, setCompletedFilter] = useState("");
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState({
    column: "id",
    direction: "asc",
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setData(result.data);
    };

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleCompletedFilterChange = (event) => {
    setCompletedFilter(event.target.value);

    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      let result = true;
      if (filter) {
        result =
          (result && item.title.toLowerCase().includes(filter.toLowerCase())) ||
          (result && item.id.toString().includes(filter.toLowerCase())) ||
          (result && item.completed.toString().includes(filter.toLowerCase()));
      }
      if (completedFilter) {
        result =
          result && item.completed.toString() === completedFilter.toString();
      }
      return result;
    });
  }, [data, filter, completedFilter]);

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
  const sortedData = useMemo(() => {
    const sorted = data.sort((a, b) => {
      const column = sortOrder.column;
      const direction = sortOrder.direction === "asc" ? 1 : -1;
      if (a[column] < b[column]) {
        return -1 * direction;
      } else if (a[column] > b[column]) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
    return sorted;
  }, [data, sortOrder]);
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
          value={completedFilter}
          onChange={(event) => handleCompletedFilterChange(event)}
        >
          <option value="">All</option>
          <option value={true}>completed</option>
          <option value={false}>not - Completed</option>
        </select>
      </form>
      <TableContainer component={Paper}>
        <Table className="tableContainer" stickyHeader>
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
                  {item.id}
                </TableCell>
                <TableCell className="tableColumn">{item.title}</TableCell>
                <TableCell className="tableColumn" align="center">
                  {item.completed ? "true" : "false"}{" "}
                </TableCell>
                <TableCell className="tableColumn" align="center">
                  <button className="btn">Add</button>
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
