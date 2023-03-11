import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./TableM.css";
import { v4 as uuidv4 } from "uuid";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import useBtn from "../../hooks/useBtn";
import {
  DirecteurBtns,
  EmployeBtns,
  ResponsableBtns,
} from "../../data/tableBtns";

const TableM = ({ title, filterOptions, columns, data, colType }) => {
  const [filter, setFilter] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const currentUser = useSelector((state) => state.auth.user);
  const [sortOrder, setSortOrder] = useState({
    column: "id",
    direction: "asc",
  });
  const [handleClose, handleShow, popupType, handleClick] = useBtn();
  const renderConfiguration = (item, type) => {
    let buttons;
    let array;
    switch (currentUser.role) {
      case "directeur":
        {
          array = DirecteurBtns;
        }
        break;
      case "responsable":
        {
          array = ResponsableBtns;
        }
        break;
      case "employe":
        {
          array = EmployeBtns;
        }
        break;
      case "relex":
        {
          array = relexBtns;
        }
        break;
      case "secretaire":
        {
          array = DirecteurBtns;
        }
        break;

      default:
        break;
    }

    buttons = array.find(
      (btn) => btn.type.toLowerCase() === type.toLowerCase()
    );

    if (!buttons) {
      return null;
    }
    const { btns, showBtn } = buttons;
    return (
      <div>
        {btns.map((button, index) => (
          <button
            className="bouton"
            key={index}
            onClick={() => handleClick(button, item, type)}
          >
            {button}
          </button>
        ))}

        {/* {showBtn && (
          <button className="btn" onClick={handleShow}>
            see
          </button>
        )} */}
      </div>
    );
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleFilterOptionChange = (event) => {
    setFilterOption(event.target.value);
    setPage(0);
  };

  const filteredData = useMemo(() => {
    const hasFilter = filter || filterOption;
    if (!hasFilter) {
      return data;
    }
    const trimmedFilter = filter.trim(); // remove leading/trailing spaces
    return data.filter((item) => {
      let result = true;
      if (trimmedFilter) {
        // use trimmed filter value
        result = columns.some((column) => {
          if (!item[column.id]) {
            return false;
          }
          let cellValue;
          if (
            item[column.id] === "createdBy" ||
            item[column.id] === "tDateDeb" ||
            item[column.id] === "tDateRet"
          ) {
            cellValue = item[column.id];
          } else {
            cellValue = item[column.id].toString().toLowerCase();
          }
          const filterValue = trimmedFilter.toLowerCase();
          return (
            cellValue.includes(filterValue) ||
            ((column.id === "idEmetteur" ||
              column.id === "idEmploye" ||
              column.id === "createdBy") &&
              (item[column.id].nom
                .toString()
                .toLowerCase()
                .includes(filterValue) ||
                item[column.id].prenom
                  .toString()
                  .toLowerCase()
                  .includes(filterValue) ||
                (item[column.id].prenom + " " + item[column.id].nom)
                  .toString()
                  .toLowerCase()
                  .includes(filterValue) ||
                (item[column.id].nom + " " + item[column.id].prenom)
                  .toString()
                  .toLowerCase()
                  .includes(filterValue) ||
                item[column.id].structure
                  .toString()
                  .toLowerCase()
                  .includes(filterValue)))
          );
        });
      }
      if (filterOption) {
        result =
          result &&
          (item?.__t === filterOption.toString() ||
            item?.etat === filterOption.toString() ||
            item?.structure === filterOption.toString() ||
            item?.role === filterOption.toString() ||
            item?.moyenTransport === filterOption.toString() ||
            item?.type === filterOption.toString());
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
  //   const sorted = paginatedData.sort((a, b) => {
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
  // }, [paginatedData, sortOrder]);
  // const handleSort = (columnId) => {
  //   const isAsc =
  //     sortOrder.column === columnId && sortOrder.direction === "asc";
  //   setSortOrder({ column: columnId, direction: isAsc ? "desc" : "asc" });
  // };

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
            {paginatedData.map((item) => {
              if (colType === "demande" || colType === "db")
                return (
                  <TableRow key={uuidv4()} className="trow">
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow(item.__t)}
                    >
                      {Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(item.createdAt)
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow(item.__t)}
                    >
                      {item.idEmetteur.nom + " " + item.idEmetteur.prenom}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow(item.__t)}
                    >
                      {item.motif}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow(item.__t)}
                    >
                      {item.idEmetteur.structure}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow(item.__t)}
                    >
                      {item.etat}
                    </TableCell>

                    <TableCell align="center" className="tableColumn">
                      {renderConfiguration(item, "demande")}
                    </TableCell>
                  </TableRow>
                );
              if (colType === "rfm")
                return (
                  <TableRow key={uuidv4()} className="trow">
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("rfm")}
                    >
                      {Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(item.createdAt)
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("rfm")}
                    >
                      {item.idEmploye?.nom + " " + item.idEmploye?.prenom}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("rfm")}
                    >
                      {item.etat}
                    </TableCell>
                    <TableCell align="center" className="tableColumn">
                      {renderConfiguration(item, "rfm")}
                    </TableCell>
                  </TableRow>
                );

              if (colType === "mission")
                return (
                  <TableRow key={uuidv4()} className="trow">
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(item.createdAt)
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {item.createdBy?.nom + " " + item.createdBy?.prenom}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {item.objetMission}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {item.budget}DA
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(item.tDateDeb)
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(item.tDateRet)
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {item.etat}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("mission")}
                    >
                      {item.raisonRefus}
                    </TableCell>
                    <TableCell align="center" className="tableColumn">
                      {renderConfiguration(item, "mission")}
                    </TableCell>
                  </TableRow>
                );
              if (colType === "user")
                return (
                  <TableRow key={uuidv4()} className="trow">
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("user")}
                    >
                      {Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(item.createdAt)
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("user")}
                    >
                      {item.nom}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("user")}
                    >
                      {item.prenom}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("user")}
                    >
                      {item.fonction}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("user")}
                    >
                      {item.email}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="tableColumn"
                      onClick={() => handleShow("user")}
                    >
                      {item.role}
                    </TableCell>
                    <TableCell align="center" className="tableColumn">
                      {renderConfiguration(item, "user")}
                    </TableCell>
                  </TableRow>
                );
            })}
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
