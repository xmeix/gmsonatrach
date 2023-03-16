import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
  Radio,
} from "@material-ui/core";
import useBtn from "../../../hooks/useBtn";

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

const PopupUpdate = ({ item, close }) => {
  const mission = item.idMission || null;
  const user = item.idEmploye || null;
  const [dates, setDates] = useState([]);
  const [body, setBody] = useState([]);
  const [hebergement, setHebergement] = useState(() =>
    item.deroulement.map((item) => item.hebergement)
  );
  const [diner, setDiner] = useState(() =>
    item.deroulement.map((item) => item.diner)
  );
  const [dejeuner, setDejeuner] = useState(() =>
    item.deroulement.map((item) => item.dejeuner)
  );
  const classes = useStyles();
  const [handleClick] = useBtn();

  useEffect(() => {
    const generateDates = () => {
      const newDates = [];
      let start = new Date(mission.tDateDeb);
      let end = new Date(mission.tDateRet);
      console.log("start " + start);
      console.log("end " + end);
      // loop through dates from start to end date
      while (start <= end) {
        newDates.push(new Date(start).toISOString());
        start.setDate(start.getDate() + 1);
      }
      setDates(newDates);
    };
    // call generateDates when component mounts
    generateDates();
  }, [mission.tDateDeb, mission.tDateRet]);

  const [observations, setObservations] = useState(() =>
    item.deroulement.map((item) => item.observation)
  );
  const handleObservationChange = (dateIndex, type) => (event) => {
    let array;
    switch (type) {
      case "observation":
        array = [...observations];
        array[dateIndex] = event.target.value;
        setObservations(array);
        break;
      case "dejeuner":
        array = [...dejeuner];
        array[dateIndex] = event.target.value;
        setDejeuner(array);
        break;
      case "diner":
        array = [...diner];
        array[dateIndex] = event.target.value;
        setDiner(array);
        break;
      case "hebergement":
        array = [...hebergement];
        array[dateIndex] = event.target.value;
        setHebergement(array);
        break;
      default:
        break;
    }
  };

  useMemo(() => {
    try {
      let newBody = [];

      for (let i = 0; i < dates.length; i++) {
        newBody.push({
          IdDate: dates[i],
          hebergement: hebergement[i] || "avec-prise-en-charge",
          dejeuner: dejeuner[i] || "avec-prise-en-charge",
          diner: diner[i] || "avec-prise-en-charge",
          observation: observations[i] || "",
        });
      }
      console.log(newBody);

      setBody(newBody);
    } catch (error) {
      console.error(error);
      setBody([]);
    }
  }, [dates, observations, hebergement, diner, dejeuner]);

  function radioInput(type, index, value) {
    let element = [];
    if (type === "hebergement") {
      element = hebergement[index];
    } else if (type === "diner") {
      element = diner[index];
    } else if (type === "dejeuner") {
      element = dejeuner[index];
    }
    if (type) {
      return (
        <Radio
          value={value}
          checked={element === value}
          onChange={handleObservationChange(index, type)}
          style={{ color: "var(--orange)" }}
          size="small"
        />
      );
    }
  }
  return (
    <div className="popup-update">
      <h3 className="title">Ordre de Mission</h3>
      <div className="direction">
        <span className="identificateur">
          N° {item._id}/ SH-ONE/{new Date().getFullYear()}
        </span>
        <span>DCG/RH - DAPS</span>
      </div>
      <div className="infoEmploye">
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
              <span>Le </span>:{" "}
              {mission &&
                Intl.DateTimeFormat(["ban", "id"]).format(
                  new Date(mission.tDateDeb)
                )}
              , <span>a:</span> __ H __ Mn
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
                  avec prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Sans prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  avec prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Sans prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  avec prise en charge
                </TableCell>
                <TableCell align="center" className={classes.tableHeaderCell}>
                  Sans prise en charge
                </TableCell>
                <TableCell align="center" />
              </TableRow>
            </TableHead>
            <TableBody>
              {dates.map((date, index) => (
                <TableRow key={index}>
                  <TableCell align="center" className={classes.tableCell}>
                    {Intl.DateTimeFormat(["ban", "id"]).format(new Date(date))}
                  </TableCell>
                  <TableCell align="center">
                    {radioInput("hebergement", index, "avec-prise-en-charge")}
                  </TableCell>
                  <TableCell align="center">
                    {radioInput("hebergement", index, "sans-prise-en-charge")}
                  </TableCell>
                  <TableCell align="center">
                    {radioInput("dejeuner", index, "avec-prise-en-charge")}
                  </TableCell>
                  <TableCell align="center">
                    {radioInput("dejeuner", index, "sans-prise-en-charge")}
                  </TableCell>
                  <TableCell align="center">
                    {radioInput("diner", index, "avec-prise-en-charge")}
                  </TableCell>
                  <TableCell align="center">
                    {radioInput("diner", index, "sans-prise-en-charge")}
                  </TableCell>
                  <TableCell align="center">
                    <input
                      value={observations[index]}
                      type="text"
                      onChange={handleObservationChange(index, "observation")}
                    />
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
              <span>Le </span>:
              {Intl.DateTimeFormat(["ban", "id"]).format(
                new Date(mission.tDateRet)
              )}
              , <span>a:</span> __ H __ Mn
            </div>
            <div className="dateContainer">
              <span>
                Date et heure d'Arrivée "au lieu de résidence ou au lieu de
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
          <span>A l'aller:</span> {mission.moyenTransport.join(" - ")}
          <br />
          <span>Au retour:</span>
          {mission.moyenTransportRet.join(" - ")}
        </div>
      </div>
      <div className="signature">
        Visa du Missionnaire Le Responsable (signataire de l'Ordre de Mission)
        Signature & griffe
      </div>

      {item.etat === "créé" && (
        <div className="buttons">
          <button
            onClick={() => {
              handleClick("update", item, "rfm", "", body);
              close();
            }}
          >
            Update
          </button>
          <button
            onClick={() => {
              handleClick("send", item, "rfm", "");
              close();
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default PopupUpdate;
