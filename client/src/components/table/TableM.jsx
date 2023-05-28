import axios from "axios";
import Empty from "./../Empty/Empty";
import { useState, useEffect, useMemo, Fragment } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import "./TableM.css";
import { v4 as uuidv4 } from "uuid";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DoNotDisturbRoundedIcon from "@mui/icons-material/DoNotDisturbRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ModeRoundedIcon from "@mui/icons-material/ModeRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
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
  Tooltip,
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
// import { useStyles } from "../popups/popupRefus/PopupUpdate";
const useStyles = makeStyles({
  table: {
    "& .MuiPaper-root, & .MuiTableContainer-root": {
      height: "330px !important",
      maxHeight: "330px !important",
    },
    "& .MuiTableCell-body": {
      fontFamily: "Montserrat, sans-serif !important",
      fontWeight: 500,
      fontSize: "12px",
      whiteSpace: "nowrap",
    },
    "& .MuiTableCell-head, & .MuiTableCell-stickyHeader": {
      fontFamily: "Montserrat, sans-serif !important",
      fontWeight: 700,
      fontSize: "11px !important",
      whiteSpace: "nowrap",
      textTransform: "capitalize",
      backgroundColor: "var(--light-gray)",
      // color: "white",
    },
    "& .MuiTableRow-root": {
      maxHeight: "50px !important",
      height: "50px !important",
    },
    tableLayout: "fixed",
    borderCollapse: "collapse",
    border: "1px solid #e0e0e0",
    width: "100%",
  },
  tableHeader: {
    border: "1px solid #e0e0e0",
  },
  tableCell: {
    flexBasis: "30%",
    padding: "10px",
    border: "1px solid #e0e0e0",
    fontSize: 13,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  // tableCell: {
  //   padding: "10px",
  //   fontSize: 13,
  //   width: "200px",
  //   // overflow: "scroll",
  // },
  tableRow: {
    "&:nth-of-type(even)": {
      background: "white !important",
    },
  },
  tableBody: {
    fontSize: 11,
  },
  title: {
    fontWeight: 700,
    fontSize: "18px",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "var(--gray)",
    paddingLeft: "1em",
    borderLeft: "solid 4px var(--gray)",
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
        className={`icon-table-btn ${button}`}
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
        {button === "accept" ? (
          <Tooltip title="accepter">
            <CheckRoundedIcon className="icn black" />
          </Tooltip>
        ) : button === "refuse" ? (
          <Tooltip title="refuser">
            <ClearRoundedIcon className="icn black" />
          </Tooltip>
        ) : button === "cancel" ? (
          <Tooltip title="annuler">
            <DoNotDisturbRoundedIcon className="icn black " />
          </Tooltip>
        ) : button === "send" ? (
          {/* <Tooltip title="envoyer">
            <SendRoundedIcon className="icn black" />
          </Tooltip> */}
        ) : button === "update" ? (
          <Tooltip title="mettre a jour">
            <ModeRoundedIcon className="icn black" />
          </Tooltip>
        ) : (
          button
        )}
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
      <div
        style={{
          display: "flex",
          gap: "1em",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
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
            item[column.id] === "createdAt" ||
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
            item["mission"]?.uid
              .toString()
              .toLowerCase()
              .includes(filterValue) ||
            item["idMission"]?.uid
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
              .includes(filterValue) ||
            item["uid"]?.toString().toLowerCase().includes(filterValue)
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
            item?.moyenTransport.includes(filterOption.toString()) ||
            item?.moyenTransportRet.includes(filterOption.toString()) ||
            item?.type === filterOption.toString() ||
            item?.mission?.structure === filterOption.toString());
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
          className={classes.tableCell}
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
          className={classes.tableCell}
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
          className={classes.tableCell}
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
          className={classes.tableCell}
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
          className={classes.tableCell}
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
          className={classes.tableCell}
          onClick={() => handleOnClick(item)}
        >
          {item.createdBy.nom + " " + item.createdBy.prenom}
        </TableCell>
      );
    } else if (property === "mission.uid") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className={classes.tableCell}
          onClick={() => handleOnClick(item)}
        >
          {item.mission?.uid}
        </TableCell>
      );
    } else if (property === "idMission.uid") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className={classes.tableCell}
          onClick={() => handleOnClick(item)}
        >
          {item.idMission?.uid}
        </TableCell>
      );
    } else if (property === "employe.nom") {
      return (
        <TableCell
          key={uuidv4()}
          align="center"
          className={classes.tableCell}
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
          className={classes.tableCell}
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
          className={
            property === "etat"
              ? `${item.etat} ${classes.tableCell}`
              : classes.tableCell
          }
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
          "uid",
          "idEmetteur.nom + ' ' + idEmetteur.prenom",
          // "motif",
          "etat",
        ]);
        break;

      case "rfm":
        setCols([
          "createdAt",
          "idEmploye.nom + ' ' + idEmploye.prenom",
          "idMission.uid",
          "etat",
        ]);
        break;

      case "mission":
        setCols([
          "createdAt",
          "uid",
          "createdBy.nom + ' ' + createdBy.prenom",
          "tDateDeb",
          "etat",
        ]);
        break;
      case "om":
        setCols([
          "createdAt",
          "uid",
          "employe.nom",
          "employe.prenom",
          "mission.uid",
        ]);
        break;

      case "user":
        setCols(["createdAt", "uid", "nom", "prenom"]);
        break;

      default:
        setCols([]);
        break;
    }
  }, [colType]);

  /**_______________________________________________________________________________________________________________________________ */

  return (
    <div className="table">
      <p className={classes.title}>{title ? title : "list"}</p>
      <form className="control">
        <div className="control-search">
          <div style={{ position: "relative", flex: 3 }}>
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
          <div
            style={{
              flex: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SortRoundedIcon
              className={
                sortOrder.direction === "asc" ? "icon sort" : "icon sort rotate"
              }
              onClick={handleSort}
            />
            <div
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--gray)",
              }}
            >
              tri
            </div>
          </div>
        </div>
        <div className="countControl">{filteredData.length} lignes</div>

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
        style={{
          width: "80vw",
        }}
        aria-label="table"
      >
        <Table className={classes.table} stickyHeader size="small">
          <TableHead className={classes.tableHeader}>
            <TableRow className={`${classes.tableRow} trow`}>
              {columns.map((column) => (
                <TableCell
                  className={classes.tableCell}
                  key={column.id}
                  align="center"
                >
                  {column.label}
                </TableCell>
              ))}
              {colType !== "user" && (
                <TableCell className={classes.tableCell} align="center">
                  Configuration
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {paginatedData.length !== 0 ? (
              paginatedData?.map((item) => {
                if (colType === "demande" || colType === "db") {
                  return (
                    <TableRow
                      key={uuidv4()}
                      className={`${classes.tableRow} trow`}
                    >
                      {cols.map((col) => tableCell(item, col))}
                      <TableCell align="center" className={classes.tableCell}>
                        {renderConfiguration(item, item.__t.toLowerCase())}
                      </TableCell>
                    </TableRow>
                  );
                } else if (colType !== "demande" && colType !== "db") {
                  return (
                    <TableRow
                      key={uuidv4()}
                      className={`${classes.tableRow} trow`}
                    >
                      {cols.map((col) => tableCell(item, col))}
                      {colType !== "user" && (
                        <TableCell align="center" className={classes.tableCell}>
                          {renderConfiguration(item, colType)}
                        </TableCell>
                      )}
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
