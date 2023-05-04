import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  Radio,
  TableContainer,
} from "@material-ui/core";
const useStyles = makeStyles({
  table2: {
    borderCollapse: "separate",
    border: "none",
  },
  tableCell2: {
    padding: "10px",
    fontWeight: 500,
    fontSize: 13,
    border: "none",
  },
});

const PopupUser = ({ item }) => {
  const classes = useStyles();
  const {
    createdAt,
    _id,
    email,
    etat,
    fonction,
    nom,
    numTel,
    prenom,
    role,
    structure,
  } = item;

  const OmLabelLine = ({ label, content }) => (
    <div className="om-label-line">
      <div className="om-label">{label}</div>
      <div className="om-content" style={{ flex: 1 }}>
        {content}
      </div>
    </div>
  );
  const data = [
    { label: "Matricule", content: `: ${_id}` },
    { label: "role", content: `: ${role}` },
    { label: "etat", content: `: ${etat || "/"}` },
    { label: "Nom & Prénom", content: `: ${nom} ${prenom}` },
    { label: "structure", content: `: ${structure}` },
    { label: "fonction", content: `: ${fonction}` },
    { label: "email", content: `: ${email}` },
    { label: "numero de téléphone", content: `: ${numTel}` },
  ];

  return (
    <div className="popup-user">
      <div className="title">User profile</div>

      <TableContainer>
        <Table className={classes.table2}>
          <TableBody>
            {data.map((el, i) => {
              if (el.label === "etat") {
                if (role === "employe") {
                  return null;
                } else
                  return (
                    <TableRow key={i}>
                      <TableCell className={classes.tableCell2}>
                        {el.label}
                      </TableCell>
                      <TableCell className={classes.tableCell2}>
                        {el.content}
                      </TableCell>
                    </TableRow>
                  );
              }
              if (el.label !== "etat") {
                return (
                  <TableRow key={i}>
                    <TableCell className={classes.tableCell2}>
                      {el.label}
                    </TableCell>
                    <TableCell className={classes.tableCell2}>
                      {el.content}
                    </TableCell>
                  </TableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PopupUser;
