import { useState, useCallback, useEffect } from "react";
import { read, utils, writeFile } from "xlsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import TableM from "./../../../components/table/TableM";
import { useAxios } from "../../../hooks/useAxios";
import { useSelector } from "react-redux";
import { validateMission } from "../../../utils/formFieldsVerifications";
const useStyles = makeStyles({
  table2: {
    borderCollapse: "separate",
    borderRight: "solid 1px black",
    borderTop: "solid 1px black",
  },
  tableCell2: {
    padding: "10px",
    fontWeight: 500,
    fontSize: 13,
    borderLeft: "solid 1px black",
    borderBottom: "solid 1px black",
  },
});
const UsersDashboard = () => {
  const classes = useStyles();
  const [jsonData, setJsonData] = useState(null);
  const [missionData, setMissionData] = useState([]);
  const [planningData, setPlanningData] = useState([]);
  const [planningDates, setPlanningDates] = useState([]);
  const { callApi, error, isLoading, successMsg } = useAxios();
  const missions = useSelector((state) => state.auth.missions);
  const [errors, setErrors] = useState([]);
  const users = useSelector((state) => state.auth.users);
  const currentUser = useSelector((state) => state.auth.user);
  const [success, setSuccess] = useState(false);
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file || !/\.xlsx?$/.test(file.name)) {
      alert("Please select a valid Excel file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = read(data);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const newJsonData = utils.sheet_to_json(worksheet, { header: 1 });
        setJsonData(newJsonData);
        // console.log(newJsonData);
      } catch (error) {
        console.log("Error processing the file. Please try again.", error);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  useEffect(() => {
    if (!jsonData) return;
    else {
      extractPlanningData();
      extractMissionData();
    }
  }, [jsonData]);

  const handleUpload = () => {
    if (!planningData || !planningDates || !missionData) return;
    else createMissions();
  };

  useEffect(() => {
    if (!planningData) return;
    else getPlanningDates();
  }, [planningData]);

  const createMissions = () => {
    let allMissions = [];
    let errs = [];
    // loop through mission
    for (let i = 1; i < missionData.length; i++) {
      let mission = missionData[i];
      let dateDeb;
      let dateFin;
      let employees = [];
      let missionObject = {};

      // loop through employees(planning)
      // get employee-ids for each mission
      for (let j = 2; j < planningData.length; j++) {
        const element = planningData[j];
        if (element.includes(mission[0])) {
          // console.log({ idUser: element[0], mission: mission });
          // here we have to look for all the users and push them to the array

          employees.push(element[0].trim());
        }
      }

      //get dates for each mission
      for (let i = 2; i < planningData.length; i++) {
        const element = planningData[i];
        // verifier si la ligne i dans le planning contient le id mission
        if (element.includes(mission[0])) {
          // si elle contient id mission , on trouve le premier on garde son index et le jour equiv
          const indDeb = element.indexOf(mission[0]);
          const jD = planningData[1][indDeb];
          dateDeb = getDay(jD, indDeb);
          // console.log([mission[0], dateDeb]);

          for (let r = indDeb; r < element.length; r++) {
            const s = element[r];

            // console.log(mission[0], s);
            if (s === "empty" || s !== mission[0]) {
              const indFin = r - 1;
              const jF = planningData[1][indFin];
              dateFin = getDay(jF, indFin);

              break;
            }
          }
        }

        if (dateDeb && dateFin) {
          missionObject = {
            objetMission: mission[1]?.trim(),
            type: mission[2]?.toLowerCase()?.trim(),
            pays: mission[3]?.toLowerCase()?.trim(),
            destination: mission[4]?.toLowerCase()?.trim(),
            tDateDeb: dateDeb,
            tDateRet: dateFin,
            budget: mission[7],
            moyenTransport: mission[5]
              ?.split("-")
              .map((item) => item?.toLowerCase()?.trim()),
            moyenTransportRet: mission[6]
              ?.split("-")
              .map((item) => item?.toLowerCase()?.trim()),
            employes: employees,
            structure: mission[8]?.toUpperCase()?.trim(),
          };
          // console.log(missionObject);
          //verify the mission fields
          //each time we find errors we push to the errors array
          let object = {
            type: "import",
            users,
            missions,
          };
          validateMission(missionObject, currentUser, object);
          if (
            Object.keys(validateMission(missionObject, currentUser, object))
              .length !== 0
          ) {
            errs.push([
              ...errors,
              validateMission(missionObject, currentUser, object),
            ]);
          } else allMissions.push(missionObject);
          // here we have to create missions
          // callApi("post", "/mission", missionObject);
          // console.log("mission sent");

          break;
        }
      }
    }

    setErrors(errs);
    if (errs.length !== 0) {
      setSuccess(false);
    } else {
      console.log("jerer");
      allMissions.map((m) => {
        callApi("post", "/mission", m);
      });
      allMissions = [];
      setErrors([]);
      setSuccess(true);
    }
  };

  const getDay = (j, ind) => {
    // console.log(planningDates, j, ind);
    const d = planningDates
      .filter((e) => (e[1] < ind && ind < e[2]) || e[1] === ind || e[2] === ind)
      .map((e) => e);
    if (d.length === 0) {
      return null;
    }
    const [month, year] = d[0][0].split("/");
    // console.log(month, year);
    const date = new Date(year, month - 1, j);
    return date;
  };
  const extractMissionData = () => {
    const subset = jsonData
      .slice(1)
      .filter((row) => row.length > 0 && row[0])
      .map((row) => row.slice(0, 9));

    setMissionData(subset);

    // console.log(missionData[0]);
  };
  const extractPlanningData = () => {
    const longestRow = jsonData
      .slice(12)
      .map((row) => row.slice(10))
      .reduce((acc, row) => {
        return row.length > acc.length ? row : acc;
      }, []);
    // console.log(longestRow);

    const subset = jsonData.slice(11).map((row, i) => {
      // replace undefined values with a default value, e.g. "-"
      return row.slice(10, longestRow.length).map((val) => val);
    });

    let ew = [];
    for (let index = 0; index < subset.length; index++) {
      const element = subset[index];
      let n = [];
      let j;
      for (j = 0; j < element.length; j++) {
        const e = element[j];
        if (e) {
          n.push(e);
        } else n.push("empty");
      }

      if (j < longestRow.length) {
        for (let index = 0; index < longestRow.length; index++) {
          n.push("empty");
        }
      }
      ew.push(n);
    }
    // console.log(ew);
    setPlanningData(ew);
  };

  const getPlanningDates = () => {
    if (!planningData) return;
    else {
      const dates = planningData[0]
        ?.map((el, i) => {
          let k;
          if (el !== "empty") {
            k = planningData[1][i];
            const [month, year] = el.split("/");
            const date = new Date(year, month - 1, 1);
            date.setHours(-1); // Sets the date to the last day of the previous month

            const numDays = date.getDate();
            return [el, i, numDays - k + i + 1];
          } else return [0, 0, 0, 0];
        })
        .filter((e) => !e.includes(0))
        .map((e) => e);

      setPlanningDates(dates);
    }
  };

  return (
    <div className="usersDashboard" style={{ overflow: "scroll" }}>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Importer</button>
        {success && (
          <div className="file-success-message">
            Chargement de données avec succés
          </div>
        )}
        {errors.length > 0 && (
          <div className="file-error-message">
            Désolé, votre fichier de données contient des erreurs. Veuillez
            vérifier les points suivants:
            <ul>
              <li>
                Assurez-vous que tous les champs obligatoires sont remplis.
                Certains champs peuvent manquer.{" "}
              </li>
              <li>
                Vérifiez qu'aucun des missionnaires n'a déjà des missions
                prévues à la même période. Il y a peut-être un conflit
                d'horaire.{" "}
              </li>
              <li>Corrigez les erreurs et importer à nouveau le fichier.</li>
            </ul>
          </div>
        )}
        {errors.length === 0 && missionData.length > 0 && (
          <>
            <div>Informations sur les missions</div>
            <Table className={missionData.length > 0 ? classes.table2 : ""}>
              <TableHead>
                <TableRow>
                  {missionData[0]?.map((item, i) => (
                    <TableCell key={i} className={classes.tableCell2}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {missionData?.slice(1).map((subArray, i) => (
                  <TableRow key={i}>
                    {subArray.map((item, j) => (
                      <TableCell key={j} className={classes.tableCell2}>
                        {item}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Table className={missionData.length > 0 ? classes.table2 : ""}>
              <TableHead>
                <TableRow>
                  {planningData[0]?.map((item, i) => (
                    <TableCell key={i} className={classes.tableCell2}>
                      {item}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {planningData?.slice(1).map((subArray, i) => (
                  <TableRow key={i}>
                    {subArray.flatMap((item, j) => (
                      <TableCell key={j} className={classes.tableCell2}>
                        {item !== "empty" ? item : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersDashboard;
