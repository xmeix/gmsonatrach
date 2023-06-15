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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  budgetVariance,
  employeeProductivity,
  missionCostPerEmployee,
  tasksResolutionRate,
  ticketResolutionRate,
} from "../../utils/fmissions_analytics";
import { getBestEmployes } from "../../api/apiCalls/getCalls";
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

const RateTable = ({ type }) => {
  const classes = useStyles();

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

  return (
    <div className="rate-table">
      <TableContainer component={Paper} aria-label="table">
        {type === 1 && (
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.tableCell}>ID Mission</TableCell>
                <TableCell className={classes.tableCell}>
                  l'écart budgétaire en pourcentage
                </TableCell>
                <TableCell className={classes.tableCell}>
                  taux de résolution des tickets
                </TableCell>
                <TableCell className={classes.tableCell}>
                  taux de résolution des taches mission
                </TableCell>
                <TableCell className={classes.tableCell}>
                  frais de mission par employé
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {paginatedData.map((mission, i) => (
                <TableRow key={i} className={classes.tableRow}>
                  <TableCell className={classes.tableCell}>
                    {mission.uid}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {budgetVariance(mission) + "%"}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {ticketResolutionRate(mission, tickets) + "%"}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {tasksResolutionRate(mission) + "%"}
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
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.tableCell}>ID Employé</TableCell>
                <TableCell className={classes.tableCell}>Nom</TableCell>
                <TableCell className={classes.tableCell}>Prénom</TableCell>
                <TableCell className={classes.tableCell}>Structure</TableCell>
                <TableCell className={classes.tableCell}>
                  taux de productivité
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {paginatedData.map((user, i) => (
                <TableRow key={i} className={classes.tableRow}>
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
                    {employeeProductivity(user, endedMissions)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {type === 3 && (
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow className={classes.tableRow}>
                <TableCell className={classes.tableCell}>Classement</TableCell>
                <TableCell className={classes.tableCell}>ID Employé</TableCell>
                <TableCell className={classes.tableCell}>Nom</TableCell>
                <TableCell className={classes.tableCell}>Prénom</TableCell>
                <TableCell className={classes.tableCell}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableBody}>
              {paginatedData?.map((emp, i) => (
                <TableRow key={i} className={classes.tableRow}>
                  <TableCell className={classes.tableCell}>{i}</TableCell>
                  <TableCell className={classes.tableCell}>{emp.uid}</TableCell>
                  <TableCell className={classes.tableCell}>{emp.nom}</TableCell>
                  <TableCell className={classes.tableCell}>
                    {emp.prenom}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {emp.totalSolvedTickets}
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
      />
    </div>
  );
};

export default RateTable;
