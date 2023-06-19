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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  AverageTicketPerMissionPerEmployee,
  budgetVariance,
  employeeProductivity,
  missionCostPerEmployee,
  tasksResolutionRate,
  ticketResolutionRate,
} from "../../utils/fmissions_analytics";
import { getBestEmployes } from "../../api/apiCalls/getCalls";
import usePopup from "../../hooks/usePopup";
import Popup from "../popups/Popup";
import "./RateTable.css";
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
    "& span": {
      padding: "0.3em 1em",
      borderRadius: "10px",
    },
  },
  tableRow: {
    "&:nth-of-type(even)": {
      background: "white !important",
    },
    "&:hover": {
      background: "var(--light-gray) !important",
      cursor: "pointer",
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

const RateTable = ({ type }) => {
  const classes = useStyles();
  const [isOpen, openPopup, closePopup, popupType] = usePopup();
  const [savedItem, setSavedItem] = useState(null);
  const [savedType, setSavedType] = useState("");
  const { users } = useSelector((state) => state.auth);
  const { missions } = useSelector((state) => state.mission);
  const { tickets } = useSelector((state) => state.ticket);
  const endedMissions = missions.filter((m) => m.etat === "terminée");
  const missionnaires = users.filter(
    (m) => m.role !== "secretaire" && m.role !== "relex"
  );
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [bestEmps, setBestEmps] = useState([]);

  useEffect(() => {
    let emps = [];
    if (type === 3) {
      const promise = getBestEmployes("/ticket/employes");

      promise
        .then((resolvedArray) => {
          setBestEmps(resolvedArray);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [type]);

  const paginatedData =
    type === 1
      ? endedMissions.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : type === 2
      ? missionnaires.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : bestEmps?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const sortedData =
    type === 2
      ? paginatedData.slice().sort((a, b) => {
          const productivityA = employeeProductivity(a, endedMissions);
          const productivityB = employeeProductivity(b, endedMissions);

          return productivityB - productivityA; // Sort in descending order
        })
      : [];
  const handleCloseForm = () => {
    console.log("are closing");
    setSavedItem(null);
    closePopup();
  };
  return (
    <div className="rate-table">
      <TableContainer component={Paper} aria-label="table">
        {type === 1 && (
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableCell}>ID Mission</TableCell>
                <Tooltip title="(Budget Estimé - Budget Consomé) / Budget Estimé">
                  <TableCell className={classes.tableCell}>
                    l'écart budgétaire en pourcentage
                  </TableCell>
                </Tooltip>
                <Tooltip title="Nombre tickets cloturés / nombre tickets total">
                  <TableCell className={classes.tableCell}>
                    taux de résolution des tickets
                  </TableCell>
                </Tooltip>
                <Tooltip title="Nombre Taches accomplies / nombre Taches total">
                  <TableCell className={classes.tableCell}>
                    taux de résolution des taches mission
                  </TableCell>
                </Tooltip>
                <Tooltip title="Budget Consommé de la mission / nombre Employés ">
                  <TableCell className={classes.tableCell}>
                    frais de mission par employé
                  </TableCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {paginatedData.map((mission, i) => (
                <TableRow
                  key={i}
                  className={classes.tableRow}
                  onClick={() => {
                    setSavedItem(mission);
                    setSavedType("mission");
                    openPopup("mission");
                  }}
                >
                  <TableCell className={classes.tableCell}>
                    {mission.uid}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <span
                      className={
                        budgetVariance(mission) <= 0 ? "bhigh" : "ghigh"
                      }
                    >
                      {budgetVariance(mission) + "%"}
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <span
                      className={
                        ticketResolutionRate(mission, tickets) <= 0
                          ? "bhigh"
                          : "ghigh"
                      }
                    >
                      {" "}
                      {ticketResolutionRate(mission, tickets) + "%"}
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <span
                      className={
                        tasksResolutionRate(mission) <= 0 ? "bhigh" : "ghigh"
                      }
                    >
                      {" "}
                      {tasksResolutionRate(mission) + "%"}
                    </span>
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {missionCostPerEmployee(mission) + "DZD"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {type === 2 && (
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableCell}>ID Employé</TableCell>
                <TableCell className={classes.tableCell}>Nom</TableCell>
                <TableCell className={classes.tableCell}>Prénom</TableCell>
                <TableCell className={classes.tableCell}>Structure</TableCell>
                <Tooltip title="Nombre Missions Terminées / Durée passée">
                  <TableCell className={classes.tableCell}>
                    taux de productivité (missions/jours)
                  </TableCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {sortedData.map((user, i) => (
                <TableRow
                  key={i}
                  className={classes.tableRow}
                  style={{ backgroundColor: i === 0 ? "var(--blue2)" : "" }}
                  onClick={() => {
                    setSavedItem(user);
                    setSavedType("user");
                    openPopup("user");
                  }}
                >
                  <TableCell className={classes.tableCell}>
                    {user.uid}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {user.nom}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {user.prenom}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {user.structure}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {employeeProductivity(user, endedMissions) + " m/j"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {type === 3 && (
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell className={classes.tableCell}>Classement</TableCell>
                <TableCell className={classes.tableCell}>ID Employé</TableCell>
                <TableCell className={classes.tableCell}>Nom</TableCell>
                <TableCell className={classes.tableCell}>Prénom</TableCell>
                <Tooltip title="Nombre total de tickets clos / Nombre total de missions">
                  <TableCell className={classes.tableCell}>
                    Nombre moyen de tickets traités par mission
                  </TableCell>
                </Tooltip>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {paginatedData?.map((emp, i) => (
                <TableRow
                  key={i}
                  className={classes.tableRow}
                  onClick={() => {
                    setSavedItem(emp);
                    setSavedType("user");
                    openPopup("user");
                  }}
                >
                  <TableCell className={classes.tableCell}>{i}</TableCell>
                  <TableCell className={classes.tableCell}>{emp.uid}</TableCell>
                  <TableCell className={classes.tableCell}>{emp.nom}</TableCell>
                  <TableCell className={classes.tableCell}>
                    {emp.prenom}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <span
                      className={
                        AverageTicketPerMissionPerEmployee(
                          emp,
                          endedMissions,
                          emp.totalSolvedTickets
                        ) < 25
                          ? "bhigh"
                          : "ghigh"
                      }
                    >
                      {AverageTicketPerMissionPerEmployee(
                        emp,
                        endedMissions,
                        emp.totalSolvedTickets
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        className="pagination"
        rowsPerPageOptions={[3, 10, 25]}
        component="div"
        count={
          type === 1 || type === 2 ? endedMissions.length : bestEmps.length
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />{" "}
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
      )}{" "}
      {isOpen && <div className="closePopup" onClick={handleCloseForm}></div>}
    </div>
  );
};

export default RateTable;
