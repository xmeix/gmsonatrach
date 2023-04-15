import { TableCell, TableRow } from "@mui/material";
import "./Empty.css";
const Empty = ({ cols }) => {
  return (
    <TableRow>
      <TableCell align="center" colSpan={cols + 1} className="emptyTable">
        Il n'y a pas de données disponibles
      </TableCell>
    </TableRow>
  );
};

export default Empty;
