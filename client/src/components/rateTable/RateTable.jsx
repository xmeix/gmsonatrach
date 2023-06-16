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
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  budgetVariance,
  missionCostPerEmployee,
  tasksResolutionRate,
  ticketResolutionRate,
} from "../../utils/fmissions_analytics";
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
const RateTable = () => {
  const classes = useStyles();

  const { missions, tickets, users } = useSelector((state) => state.auth);
  const endedMissions = missions.filter((m) => m.etat === "terminée");
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [page, setPage] = useState(0);

  //   console.log(JSON.stringify(endedMissions.map((m) => m._id)));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = endedMissions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <div className="rate-table">
      <TableContainer component={Paper} aria-label="table">
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
      </TableContainer>
      <TablePagination
        className="pagination"
        rowsPerPageOptions={[3, 10, 25]}
        component="div"
        count={endedMissions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default RateTable;
