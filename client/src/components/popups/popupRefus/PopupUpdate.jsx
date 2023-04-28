import { Fragment, useEffect, useMemo, useState } from "react";
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
import { useSelector } from "react-redux";
import PopupSurvey from "./PopupSurvey";
import useFileGenerator from "../../../hooks/useFileGenerator";
import { convertLength } from "@mui/material/styles/cssUtils";

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
const OmLabelLine = ({ label, content }) => (
  <div className="om-label-line">
    <div className="om-label">{label}</div>
    <div className="om-content">{content}</div>
  </div>
);

const PopupUpdate = ({ item, close, setSurvey }) => {
  const { createdAt, _id, idEmploye, idMission, deroulement } = item;

  const mission = idMission || null;
  const user = idEmploye || null;
  const [dates, setDates] = useState([]);
  const [body, setBody] = useState([]);
  const [bodyFile, setBodyFile] = useState([]);
  const [hebergement, setHebergement] = useState(() =>
    item.deroulement.map((item) => item.hebergement)
  );
  const currentUser = useSelector((state) => state.auth.user);
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
      let newBodyFile = [];

      for (let i = 0; i < dates.length; i++) {
        newBody.push({
          IdDate: dates[i],
          hebergement: hebergement[i] || "avec-prise-en-charge",
          dejeuner: dejeuner[i] || "avec-prise-en-charge",
          diner: diner[i] || "avec-prise-en-charge",
          observation: observations[i] || "",
        });
        newBodyFile.push({
          IdDate: dates[i],
          hebergementA:
            hebergement[i] !== "sans-prise-en-charge" ? true : false,
          hebergementB:
            hebergement[i] === "sans-prise-en-charge" ? true : false,
          dejeunerA: dejeuner[i] !== "sans-prise-en-charge" ? true : false,
          dejeunerB: dejeuner[i] === "sans-prise-en-charge" ? true : false,
          dinerA: diner[i] !== "sans-prise-en-charge" ? true : false,
          dinerB: diner[i] === "sans-prise-en-charge" ? true : false,
          observation: observations[i] || "",
        });
      }

      setBody(newBody);
      setBodyFile(newBodyFile);
    } catch (error) {
      console.error(error);
      setBody([]);
      setBodyFile([]);
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
      if (idEmploye._id === idEmploye._id && item.etat === "créé") {
        return (
          <Radio
            value={value}
            checked={element === value}
            onChange={handleObservationChange(index, type)}
            style={{ color: "var(--orange)" }}
            size="small"
          />
        );
      } else return <div className="x">{element === value && "X"}</div>;
    }
  }

  const [body2, setBody2] = useState({
    dateDebA: item.idMission.DateDebA || item.idMission.tDateDeb,
    dateRetA: item.idMission.DateRetA || item.idMission.tDateRet,
    tDateDeb: item.idMission.tDateDeb,
    tDateRet: item.idMission.tDateRet,
  });
  console.log(mission.DateRetA);

  function addToDate(value, type) {
    let newDate;
    let [hours, minutes] = value.split(":").map(Number);
    switch (type) {
      case 1:
        newDate = new Date(body2.tDateDeb);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);

        console.log(newDate);
        setBody2({
          ...body2,
          tDateDeb: new Date(newDate).toISOString(),
        });
        break;
      case 2:
        setBody2({
          ...body2,
          dateDebA: value,
        });
        break;
      case 3:
        newDate = new Date(body2.dateDebA);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);

        setBody2({
          ...body2,
          dateDebA: new Date(newDate).toISOString(),
        });
        break;
      case 4:
        newDate = new Date(body2.tDateRet);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);

        setBody2({
          ...body2,
          tDateRet: new Date(newDate).toISOString(),
        });
        break;
      case 5:
        setBody2({
          ...body2,
          dateRetA: value,
        });
        break;
      case 6:
        newDate = new Date(body2.dateRetA);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);

        setBody2({
          ...body2,
          dateRetA: new Date(newDate).toISOString(),
        });
        break;
      default:
        break;
    }
  }
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [justSent, setJustSent] = useState(false);
  const FileItem = {
    deroulement: bodyFile,
    moyenTransport: mission.moyenTransport.join(" - "),
    moyenTransportRet: mission.moyenTransportRet.join(" - "),

    timeretourA:
      new Date(body2.dateRetA).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) || "",
    dateretourA: Intl.DateTimeFormat(["ban", "id"]).format(
      new Date(body2.dateRetA)
    ),

    timetDateRet: new Date(idMission.tDateRet).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),

    tDateRet: Intl.DateTimeFormat(["ban", "id"]).format(
      new Date(idMission.tDateRet)
    ),
    timedebutA:
      new Date(body2.dateDebA).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) || "",
    dateDebA: Intl.DateTimeFormat(["ban", "id"]).format(
      new Date(body2.dateDebA)
    ),

    timetDateDeb: new Date(idMission.tDateDeb).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    tDateDeb: Intl.DateTimeFormat(["ban", "id"]).format(
      new Date(idMission.tDateDeb)
    ),
    parcours:
      mission.lieuDep + " Alger " + mission.destination + " " + mission.pays,
    pays: mission.pays,
    objetMission: mission.objetMission,
    structure: idEmploye.structure,
    fonction: idEmploye.fonction,
    nom: idEmploye.nom,
    prenom: idEmploye.prenom,
    idEmp: idEmploye._id,
    year: new Date().getFullYear(),
    id: item._id,
    date: Intl.DateTimeFormat(["ban", "id"]).format(new Date(item.createdAt)),
  };

  const [generateDocument] = useFileGenerator(
    FileItem,
    "/my-template-RFM.docx",
    `Compte-Rendu-${_id}.docx`
  );
  return (
    <>
      {!justSent && (
        <div className="popup-update">
          <h3 className="title">Compte Rendu de Mission</h3>
          <div className="direction">
            <div>
              Du
              <span>{" " + FileItem.date}</span>
            </div>
            <span className="identificateur">
              N° {FileItem.id}/ SH-ONE/{FileItem.year}
            </span>
            <span>DCG/RH - DAPS</span>
          </div>
          <div className="infoEmploye">
            <OmLabelLine label="Matricule" content={": " + idEmploye._id} />
            <OmLabelLine
              label="Nom & Prénoms"
              content={": " + FileItem.nom + " " + FileItem.prenom}
            />
            <OmLabelLine label="fonction" content={": " + FileItem.fonction} />
            <OmLabelLine
              label="structure"
              content={": " + FileItem.structure}
            />
          </div>
          <div className="infoMission">
            <OmLabelLine
              label="Objet de la mission"
              content={": " + FileItem.objetMission}
            />
            <OmLabelLine
              label="Itinéraire"
              content={": " + FileItem.parcours}
            />

            <div className="dates">
              <span className="subTitle">Début de Mission:</span>
              <div className="dateContainer">
                <span>
                  Date et heure du départ (du lieu de résidence ou du lieu de
                  travail habituel)
                </span>
                <div className="dateContent">
                  <span>Le </span>:
                  {mission &&
                    " " +
                      FileItem.tDateDeb}
                  , <span>a:</span>
                  {item.etat === "créé" ? (
                    <input
                      className="pop-input"
                      type="time"
                      defaultValue={FileItem.timetDateDeb}
                      onChange={(e) => addToDate(e.target.value, 1)}
                    />
                  ) : (
                    FileItem.timetDateDeb + " H"
                  )}
                </div>
                <div className="dateContainer">
                  <span>
                    Date et heure d'Arrivée ( au lieu où doit se dérouler la
                    mission )
                  </span>
                </div>
                <div className="dateContent">
                  <span>Le </span>:
                  {item.etat === "créé" ? (
                    <input
                      className="pop-input"
                      type="date"
                      defaultValue={
                        new Date(mission.DateDebA).toISOString().split("T")[0]
                      }
                      onChange={(e) => addToDate(e.target.value, 2)}
                    />
                  ) : (
                    " " + FileItem.dateDebA
                  )}
                  , <span>a:</span>
                  {item.etat === "créé" ? (
                    <input
                      className="pop-input"
                      type="time"
                      defaultValue={FileItem.timedebutA}
                      onChange={(e) => addToDate(e.target.value, 3)}
                    />
                  ) : (
                    FileItem.timedebutA + " H"
                  )}
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
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
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
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
                      Observation
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" />
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
                      avec prise en charge
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
                      Sans prise en charge
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
                      avec prise en charge
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
                      Sans prise en charge
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
                      avec prise en charge
                    </TableCell>
                    <TableCell
                      align="center"
                      className={classes.tableHeaderCell}
                    >
                      Sans prise en charge
                    </TableCell>
                    <TableCell align="center" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dates.map((date, index) => (
                    <TableRow key={index}>
                      <TableCell align="center" className={classes.tableCell}>
                        {" " +
                          Intl.DateTimeFormat(["ban", "id"]).format(
                            new Date(date)
                          )}
                      </TableCell>
                      {["hebergement", "dejeuner", "diner"].map((event, i) => {
                        return (
                          <Fragment key={i}>
                            <TableCell align="center">
                              {radioInput(event, index, "avec-prise-en-charge")}
                            </TableCell>
                            <TableCell align="center">
                              {radioInput(event, index, "sans-prise-en-charge")}
                            </TableCell>
                          </Fragment>
                        );
                      })}

                      <TableCell align="center">
                        {idEmploye._id === idEmploye._id &&
                          item.etat === "créé" && (
                            <input
                              className="pop-input"
                              value={observations[index]}
                              type="text"
                              onChange={handleObservationChange(
                                index,
                                "observation"
                              )}
                            />
                          )}

                        {(idEmploye._id !== idEmploye._id ||
                          item.etat !== "créé") && (
                          <div>{observations[index]}</div>
                        )}
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
                  Date et heure du départ "du lieu où avait été déroulée la
                  mission"
                </span>
                <div className="dateContent">
                  <span>Le </span>:{" " + FileItem.tDateRet}, <span>a:</span>
                  {item.etat === "créé" ? (
                    <input
                      className="pop-input"
                      type="time"
                      defaultValue={FileItem.timetDateRet}
                      onChange={(e) => addToDate(e.target.value, 4)}
                    />
                  ) : (
                    FileItem.timetDateRet + "H"
                  )}
                </div>
                <div className="dateContainer">
                  <span>
                    Date et heure d'Arrivée "au lieu de résidence ou au lieu de
                    travail habituel"
                  </span>
                </div>
                <div className="dateContent">
                  <span>Le </span>:
                  {item.etat === "créé" ? (
                    <input
                      className="pop-input"
                      type="date"
                      defaultValue={new Date(mission.DateRetA).toISOString().split("T")[0]}
                      onChange={(e) => addToDate(e.target.value, 5)}
                    />
                  ) : (
                    " " + FileItem.dateretourA
                  )}
                  , <span>a:</span>
                  {item.etat === "créé" ? (
                    <input
                      className="pop-input"
                      type="time"
                      defaultValue={FileItem.timeretourA}
                      onChange={(e) => addToDate(e.target.value, 6)}
                    />
                  ) : (
                    FileItem.timeretourA + "H"
                  )}
                </div>
              </div>
            </div>
            <div className="moyens">
              <span className="subTitle">Moyens de transport utilisés :</span>
              <br />
              <div className="om-body">
                <OmLabelLine
                  label="A l'aller"
                  content={": " + FileItem.moyenTransport}
                />
                <OmLabelLine
                  label="A retour"
                  content={": " + FileItem.moyenTransportRet}
                />
              </div>
            </div>
          </div>
          <div className="signature">
            Visa du Missionnaire Le Responsable (signataire de l'Ordre de
            Mission) Signature & griffe
          </div>

          {item.etat === "créé" && idEmploye._id === idEmploye._id && (
            <div className="buttons">
              <button
                className="update"
                onClick={() => {
                  //console.log(item.idMission);
                  handleClick("update", item.idMission, "mission", "", {
                    DateDebA: new Date(body2.dateDebA),
                    DateRetA: new Date(body2.dateRetA),
                    tDateDeb: new Date(body2.tDateDeb),
                    tDateRet: new Date(body2.tDateRet),
                  });
                  handleClick("update", item, "rfm", "", { deroulement: body });
                  close();
                }}
              >
                Update
              </button>
              <button
                className="send"
                onClick={() => {
                  handleClick("update", item.idMission, "mission", "", {
                    DateDebA: body2.dateDebA,
                    DateRetA: body2.dateRetA,
                    tDateDeb: body2.tDateDeb,
                    tDateRet: body2.tDateRet,
                  });
                  handleClick("update", item, "rfm", "", { deroulement: body });
                  handleClick("send", item, "rfm", "");
                  if (item.nbRefus === 0 && item.etat !== "accepté") {
                    setSurvey(true);
                  } else {
                    close();
                  }
                }}
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
      {/* {justSent && item.nbRefus === 0 && item.etat !== "accepté" && (
        <PopupSurvey item={item} close={close} />
      )} */}
      {/* {item.etat === "accepté" && ( */}
      <button onClick={generateDocument}>Generate PDF</button>
      {/* )} */}
    </>
  );
};

export default PopupUpdate;
