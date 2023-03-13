import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    borderCollapse: "separate",
    border: "solid 1px var(--light-gray)",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "var(--blue3)",
    fontSize: "12px",
  },
  tableCell: {
    padding: "10px",
    fontWeight: 500,
    fontSize: 13,
  },
});

const PopupUpdate = ({ item }) => {
  const mission = item.idMission;
  const user = item.idEmploye;
  const [dates, setDates] = useState([]);
  const classes = useStyles();

  const generateDates = () => {
    const newDates = [];
    let end = new Date(mission.tDateDeb);
    let start = new Date(mission.tDateRet);

    // loop through dates from start to end date
    while (start <= end) {
      newDates.push(new Date(start).toISOString());
      start.setDate(start.getDate() + 1);
    }
    setDates(newDates);
  };
  // call generateDates when component mounts
  useEffect(() => {
    generateDates();
  }, []);
  return (
    <div className="popup-update">
      <h3 className="title">Ordre de Mission</h3>
      <div className="direction">DCG/RH - DAPS</div>
      <div className="infoEmploye">
        <div className="identificateur">
          <span>N°</span> {item._id}/ SH-ONE/{new Date().getFullYear()}
        </div>
        <div className="matricule">
          <span>Matricule:</span>
          {user._id}
        </div>
        <div className="nomPrenom">
          <span>Nom & Prénoms:</span> {user.nom + " " + user.prenom}
        </div>
        <div className="fonction">
          <span>Fonction :</span> {user.fonction}
        </div>
        <div className="structure">
          <span>Structure :</span> {user.structure}
        </div>
      </div>
      <div className="infoMission">
        <div className="objetMission">
          <span>Objet de la mission :</span> {mission.objetMission}
        </div>
        <div className="itineraire">
          <span>Itinéraire: </span>
          {mission.lieuDep +
            " Alger" +
            mission.destination +
            " " +
            mission.pays}
        </div>
        <div className="dates">
          <span className="subTitle">Début de Mission:</span>
          <div className="dateContainer">
            <span>
              Date et heure du départ (du lieu de résidence ou du lieu de
              travail habituel)
            </span>
            <div className="dateContent">
              <span>Le </span>: __/__/___, <span>a:</span> __ H __ Mn
            </div>
            <div className="dateContainer">
              <span>
                Date et heure d'Arrivée ( au lieu où doit se dérouler la mission
                )
              </span>
            </div>
            <div className="dateContent">
              <span>Le </span>: __/__/___, <span>a:</span> __ H __ Mn
            </div>
          </div>
        </div>

        <div className="deroulement">
          <div className="subTitle">
            Compte rendu du déroulement de la mission
          </div>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Date
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={2}
                  className={classes.tableHeaderCell}
                >
                  Hébergement
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={2}
                  className={classes.tableHeaderCell}
                >
                  Déjeuner
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={2}
                  className={classes.tableHeaderCell}
                >
                  Dîner
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Observation
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" />
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Avec prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Sans prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Avec prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Sans prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Avec prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Sans prise en charge
                </TableCell>
                <TableCell align="center" />
              </TableRow>
            </TableHead>
            <TableBody>
              {dates.map((date, i) => (
                <TableRow key={i}>
                  <TableCell align="center" className={classes.tableCell}>
                    {Intl.DateTimeFormat(["ban", "id"]).format(new Date(date))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="instruction">
            *cochez la case correspondante à chaque date.
          </div>
        </div>

        <div className="dates">
          <span className="subTitle">Fin de Mission:</span>
          <div className="dateContainer">
            <span>
              Date et heure du départ "du lieu où avait été déroulée la mission"
            </span>
            <div className="dateContent">
              <span>Le </span>: __/__/___, <span>a:</span> __ H __ Mn
            </div>
            <div className="dateContainer">
              <span>
                Date et heure d’Arrivée "au lieu de résidence ou au lieu de
                travail habituel"
              </span>
            </div>
            <div className="dateContent">
              <span>Le </span>: __/__/___, <span>a:</span> __ H __ Mn
            </div>
          </div>
        </div>
        <div className="moyens">
          <span className="subTitle">Moyens de transport utilisés :</span>{" "}
          <br />
          <span>A l'aller:</span> AVION - ROUTE <br />
          <span>Au retour:</span> AVION - ROUTE
        </div>
      </div>
      <div className="signature">
        Visa du Missionnaire Le Responsable (signataire de l'Ordre de Mission)
        Signature & griffe
      </div>
    </div>
  );
};

export default PopupUpdate;
