import axios from "axios";
import Empty from "./../Empty/Empty";
import { useState, useEffect, useMemo, Fragment } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./TableM.css";
import { v4 as uuidv4 } from "uuid";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
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
  makeStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import useBtn from "../../hooks/useBtn";
import {
  DirecteurBtns,
  EmployeBtns,
  relexBtns,
  ResponsableBtns,
} from "../../data/tableBtns";
import Popup from "../popups/Popup";
import usePopup from "../../hooks/usePopup";
const useStyles = makeStyles({
  table: {
    border: "solid 1px var(--gray2)",
    boxShadow: "none !important",
  },
});
const TableM = ({ title, filterOptions, columns, data, colType }) => {
  const classes = useStyles();

  const [filter, setFilter] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const currentUser = useSelector((state) => state.auth.user);

  //_____________________________________________________________
  const [savedItem, setSavedItem] = useState(null);
  const [savedType, setSavedType] = useState("");
  //_____________________________________________________________

  const [handleClick] = useBtn();
  const [isOpen, openPopup, closePopup, popupType] = usePopup();

  const handleCloseForm = () => {
    console.log("are closing");
    setSavedItem(null);
    closePopup();
  };
  function canAcceptOrRefuse(item, currentUser, button) {
    return (
      ((item.etat === "en-attente" &&
        item.__t === "DB" &&
        currentUser.role === "relex") ||
        (item.etat === "en-attente" &&
          currentUser.role !== "employe" &&
          currentUser.role !== "secretaire" &&
          currentUser.role !== "relex")) &&
      ["accept", "refuse"].includes(button)
    );
  }

  function canDelete(item, currentUser, button) {
    return (
      (currentUser._id !== item._id ||
        (currentUser.role === "secretaire" && item.role !== "directeur") ||
        (currentUser.role === "responsable" && item.role !== "directeur")) &&
      button === "delete"
    );
  }

  function canUpdateOrSend(item, button) {
    return (
      item.etat !== "accepté" &&
      item.etat !== "refusé" &&
      item.etat !== "en-attente" &&
      ["update", "send"].includes(button)
    );
  }
  function canCancel(item, type, button) {
    return (
      ((type === "mission" &&
        item.etat === "acceptée" &&
        item.etat !== "en-cours") ||
        item.etat === "en-attente") &&
      button === "cancel"
    );
  }

  function canCancelOther(item, type, button) {
    return (
      type !== "mission" && item.etat === "en-attente" && button === "cancel"
    );
  }
  function shouldRenderButton(item, type, button) {
    switch (button) {
      case "accept":
      case "refuse":
        return canAcceptOrRefuse(item, currentUser, button);
      case "delete":
        return canDelete(item, currentUser, button);
      case "update":
      case "send":
        return canUpdateOrSend(item, button);
      case "cancel":
        return (
          canCancel(item, type, button) || canCancelOther(item, type, button)
        );
      default:
        return false;
    }
  }
  function renderButton(button, item, type, index) {
    return (
      <button
        className={`bouton ${button}`}
        key={index}
        onClick={() => {
          if (button === "refuse") {
            openPopup("refuse");
            setSavedItem(item);
            setSavedType(type.toLowerCase());
          } else if (button === "update") {
            openPopup("update");
            setSavedItem(item);
          } else handleClick(button, item, type);
        }}
      >
        {button}
      </button>
    );
  }

  const renderConfiguration = (item, type) => {
    let buttons;
    let array;
    switch (currentUser.role) {
      case "directeur":
        array = DirecteurBtns;
        break;
      case "responsable":
        array = ResponsableBtns;
        break;
      case "employe":
        array = EmployeBtns;
        break;
      case "relex":
        array = relexBtns;
        break;
      case "secretaire":
        array = DirecteurBtns;
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
        {btns.map((button, index) => {
          if (shouldRenderButton(item, type, button))
            return renderButton(button, item, type, index);
        })}
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
                  .includes(filterValue))) ||
            item["mission"]?._id
              .toString()
              .toLowerCase()
              .includes(filterValue) ||
            item["mission"]?.objetMission
              .toString()
              .toLowerCase()
              .includes(filterValue) ||
            item["employe"]?.nom
              .toString()
              .toLowerCase()
              .includes(filterValue) ||
            item["employe"]?.prenom
              .toString()
              .toLowerCase()
              .includes(filterValue) ||
            (item["employe"]?.prenom + " " + item["employe"]?.nom)
              .toString()
              .toLowerCase()
              .includes(filterValue) ||
            (item["employe"]?.nom + " " + item["employe"]?.prenom)
              .toString()
              .toLowerCase()
              .includes(filterValue)
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

  /** HANDLE  SORT ___________________________________________________*/
  const [sortOrder, setSortOrder] = useState({
    column: "createdAt",
    direction: "desc",
  });
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortOrder]);

  const handleSort = () => {
    const isAsc = sortOrder.direction === "asc";

    setSortOrder({
      column: sortOrder.column,
      direction: isAsc ? "desc" : "asc",
    });
  };
  /**_______________________________________________ */

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /**_______________________________________________________________________________________________________________________________ */
  const handleOnClick = (item) => {
    if (colType === "demande" || colType === "db")
      openPopup(item.__t.toLowerCase());
    else if (colType === "rfm") openPopup("update");
    else openPopup(colType);

    if (colType === "mission" || colType === "user") setSavedType(colType);

    setSavedItem(item);
  };
  const tableCell = (item, property) => {
    if (["createdAt", "tDateDeb", "tDateRet"].includes(property)) {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {new Date(item[property]).toISOString().slice(0, 10)}
        </TableCell>
      );
    } else if (property === "idEmetteur.nom + ' ' + idEmetteur.prenom") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item.idEmetteur.nom + " " + item.idEmetteur.prenom}
        </TableCell>
      );
    } else if (property === "mission.objetMission") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item?.mission?.objetMission}
        </TableCell>
      );
    } else if (property === "idEmetteur.structure") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item.idEmetteur.structure}
        </TableCell>
      );
    } else if (property === "idEmploye.nom + ' ' + idEmploye.prenom") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item.idEmploye?.nom + " " + item.idEmploye?.prenom}
        </TableCell>
      );
    } else if (property === "createdBy.nom + ' ' + createdBy.prenom") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item.createdBy.nom + " " + item.createdBy.prenom}
        </TableCell>
      );
    } else if (property === "mission.id") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item.mission?._id}
        </TableCell>
      );
    } else if (property === "employe.nom") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item.employe?.nom}
        </TableCell>
      );
    } else if (property === "employe.prenom") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className="tableColumn"
          onClick={() => handleOnClick(item)}
        >
          {item.employe?.prenom}
        </TableCell>
      );
    } else
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className={property === "etat" ? item.etat : "tableColumn"}
          onClick={() => handleOnClick(item)}
        >
          {item[property]}
        </TableCell>
      );
  };
  const [cols, setCols] = useState([]);

  useEffect(() => {
    switch (colType) {
      case "demande":
      case "db":
        setCols([
          "createdAt",
          "idEmetteur.nom + ' ' + idEmetteur.prenom",
          "motif",
          "idEmetteur.structure",
          "etat",
        ]);
        break;

      case "rfm":
        setCols([
          "createdAt",
          "idEmploye.nom + ' ' + idEmploye.prenom",
          "etat",
        ]);
        break;

      case "mission":
        setCols([
          "createdAt",
          "createdBy.nom + ' ' + createdBy.prenom",
          "objetMission",
          "budget",
          "tDateDeb",
          "tDateRet",
          "etat",
          "raisonRefus",
        ]);
        break;
      case "om":
        setCols([
          "createdAt",
          "mission.id",
          "employe.nom",
          "employe.prenom",
          "mission.objetMission",
        ]);
        break;

      case "user":
        setCols(["createdAt", "nom", "prenom", "fonction", "email", "role"]);
        break;

      default:
        setCols([]);
        break;
    }
  }, [colType]);

  /**_______________________________________________________________________________________________________________________________ */

  return (
    <div className="table">
      <p className="listTitle">{title ? title : "list"}</p>
      <form className="control">
        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <div style={{ position: "relative" }}>
            {" "}
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
          <SortRoundedIcon
            className={sortOrder.direction === "asc" ? "icon" : "icon rotate"}
            onClick={handleSort}
          />
        </div>
        <div className="countControl">{filteredData.length} items</div>

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
            {paginatedData.length !== 0 ? (
              paginatedData?.map((item) => {
                if (colType === "demande" || colType === "db") {
                  return (
                    <TableRow key={uuidv4()} className="trow">
                      {cols.map((col) => tableCell(item, col))}
                      <TableCell align="center" className="tableColumn">
                        {renderConfiguration(item, item.__t.toLowerCase())}
                      </TableCell>
                    </TableRow>
                  );
                } else if (colType !== "demande" && colType !== "db") {
                  return (
                    <TableRow key={uuidv4()} className="trow">
                      {cols.map((col) => tableCell(item, col))}
                      <TableCell align="center" className="tableColumn">
                        {renderConfiguration(item, colType)}
                      </TableCell>
                    </TableRow>
                  );
                }
              })
            ) : (
              <Empty cols={cols.length} />
            )}
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

      {isOpen && (
        <>
          <Popup
            item={savedItem}
            type={savedType}
            isOpen={isOpen}
            closePopup={closePopup}
            popupType={popupType}
          />
        </>
      )}

      {isOpen && <div className="closePopup" onClick={handleCloseForm}></div>}
    </div>
  );
};

export default TableM;
