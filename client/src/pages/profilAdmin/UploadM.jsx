import { useEffect, useState } from "react";
import { useUpload } from "../../hooks/useUpload";

import "./UploadMissions.css";
import {
  checkEmployeesMission,
  validateMission,
} from "../../utils/formFieldsVerifications";
import { useSelector } from "react-redux";
import { useAxios } from "../../hooks/useAxios";
import "../../components/formulaire/Formulaire.css";

const UploadM = () => {
  const { jsonData, handleFileChange, fileName } = useUpload();
  const [errors, setErrors] = useState([]);
  const { callApi } = useAxios();
  const missions = useSelector((state) => state.mission.missions);
  const users = useSelector((state) => state.auth.users);
  const currentUser = useSelector((state) => state.auth.user);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const ErrorMessages = ({ errors }) => (
    <div className="error-message">
      Désolé, votre fichier de données contient des erreurs. Veuillez vérifier
      les points suivants:
      <ul>
        <li>
          Assurez-vous que tous les champs obligatoires sont remplis. Certains
          champs peuvent manquer.{" "}
        </li>
        <li>
          Vérifiez qu'aucun des missionnaires n'a déjà des missions prévues à la
          même période. Il y a peut-être un conflit d'horaire.{" "}
        </li>
        <li>Corrigez les erreurs et importer à nouveau le fichier.</li>
      </ul>
      {/* {errors.flatMap((obj) => Object.values(obj)).map(
          (error, index) => (
            <li key={index}>{error}</li>
          )
        )} */}
    </div>
  );

  const handleUpload = () => {
    if (jsonData) {
      // console.log(fileName);
      setErrors([]);
      if (
        jsonData[0][0] !==
        "Informations nécessaires sur les missions de travail"
      ) {
        alert("veuillez introduire un format de fichier correcte");
      } else {
        extractPlanningData();
      }
    }
  };

  const getPlanningDates = (planningData) => {
    let dates = [];
    if (!planningData) return;
    else {
      const hasValidDates = !planningData[0]
        ?.filter((el) => el !== "empty")
        .some((el, i, arr) => {
          if (i !== arr.length - 1) {
            const nextEl = arr[i + 1];
            const [month, year] = el.split("/");
            const [nmonth, nyear] = nextEl.split("/");
            const normalNextDate = new Date(year, month);
            const currentDate = new Date(year, month - 1);
            const nextDate = new Date(nyear, nmonth - 1);
            return (
              currentDate >= nextDate ||
              normalNextDate.getTime() !== nextDate.getTime()
            );
          }
          return false;
        });
      // console.log(hasValidDates);
      if (!hasValidDates) {
        setErrors([
          {
            file: "Les dates sur le calendrier ne sont pas en ordre croissant ou ne sont pas consécutives",
          },
        ]);
        return;
      } else {
        dates = planningData[0]
          ?.map((el, i) => {
            let k;
            if (el !== "empty") {
              k = planningData[1][i]; //date index
              const [month, year] = el.split("/"); //decomposer la date en moi et année
              const date = new Date(year, month, 1); // creer l objet date

              date.setHours(-1); // Sets the date to the last day of the previous month
              // console.log(date);
              // console.log(el);
              const numDays = date.getDate();
              // console.log(el, i, numDays - k + i);
              return [el, i, numDays - k + i]; //starting from 0
            } else return [0, 0, 0, 0];
          })
          .filter((e) => !e.includes(0))
          .map((e) => e);
        // console.log(dates);
        const datesHaveValidDays = dates.map((d) => {
          const [month, year] = d[0].split("/");
          const date = new Date(year, month, 0);
          // console.log(date);
          const startIndex = d[1];
          const endIndex = d[2];
          const subArray = planningData[1]
            .slice(startIndex, endIndex + 1)
            .filter((el) => el !== "empty");

          // checks if the elements in the subarray are consecutive numbers and if they are in the same order.
          const hasConsecutiveNumbers = !subArray.some((num, i, arr) => {
            if (i !== arr.length - 1) {
              const nextNum = arr[i + 1];
              return num >= nextNum || num + 1 !== nextNum;
            }
            return false;
          });

          const isValidLength = date.getDate() >= subArray[subArray.length - 1];

          return hasConsecutiveNumbers && isValidLength;
        });

        if (datesHaveValidDays.includes(false)) {
          setErrors([
            {
              file: "le calendrier ne contient pas des jours consécutives valides",
            },
          ]);
          return;
        }
      }
    }
    return dates;
  };

  const replaceEmptyCells = (data, firstIndex, secondIndex, thirdIndex) => {
    const longestRow = data
      .slice(firstIndex)
      .map((row) => row.slice(secondIndex))
      .reduce((acc, row) => {
        return row.length > acc.length ? row : acc;
      }, []);
    const subset = data?.slice(thirdIndex).map((row) => {
      return row
        .slice(secondIndex, longestRow.length)
        .map((val) => (typeof val !== "undefined" ? val : "empty"));
    });

    const planningData = subset.map((element) => {
      return [
        ...element,
        ...Array(longestRow.length - element.length).fill("empty"),
      ];
    });

    const newData = planningData.map((e) => {
      return e.map((val) => (typeof val !== "undefined" ? val : "empty"));
    });

    return newData;
  };

  const getDay = (j, ind, planningDates) => {
    // console.log(planningDates, j, ind);
    const d = planningDates
      .filter((e) => (e[1] < ind && ind < e[2]) || e[1] === ind || e[2] === ind)
      .map((e) => e);
    // console.log(d);
    if (d.length === 0) {
      return null;
    }
    const [month, year] = d[0][0].split("/");
    // console.log(month, year);
    const date = new Date(year, month - 1, j + 1).toISOString().split("T")[0];
    // console.log(date);
    return date;
  };

  const extractPlanningData = () => {
    let newData = replaceEmptyCells(jsonData, 12, 10, 11);

    // console.log("new Data ===> ", newData);
    let dates = getPlanningDates(newData);
    // console.log(dates);
    if (dates) {
      let missionData = extractMissionData();
      if (missionData) {
        // console.log("mission data ", missionData);
        createMissions(missionData, dates, newData);
      }
    }
  };

  const areArraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((element, index) => element === arr2[index]);
  };

  const extractMissionData = () => {
    const subset = jsonData
      .slice(1)
      .filter((row) => row.length > 0 && row[0])
      .map((row) => row.slice(0, 9));

    if (
      !areArraysEqual(subset[0], [
        "id",
        "objet mission",
        "type mission",
        "pays de destination",
        "circonscription administrative",
        "moyen de transport (aller)",
        "moyen de transport (retour)",
        "budget estimé",
        "structure",
      ])
    ) {
      setErrors([
        {
          file: "Identificateurs des colonnes sont erronés doivent suivre ce format: ['id', 'objet mission', 'type mission', 'pays de destination', 'circonscription administrative', 'moyen de transport (aller)', 'moyen de transport (retour)', 'budget estimé', 'structure']",
        },
      ]);
      return;
    }
    return subset;
  };

  const createMissions = (missionDatas, useDates, planningData) => {
    let allMissions = [];
    let errs = [];
    let missionData = replaceEmptyCells(missionDatas, 0, 0, 0);

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

          employees.push(element[0]);
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
          dateDeb = getDay(jD, indDeb, useDates);

          for (let r = indDeb; r < element.length; r++) {
            const s = element[r];

            // console.log(mission[0], s);
            if (s === "empty" || s !== mission[0]) {
              const indFin = r - 1;
              const jF = planningData[1][indFin];
              dateFin = getDay(jF, indFin, useDates);

              break;
            }
          }
        }

        if (dateDeb && dateFin) {
          // on doit vérifier si chaque id existe deja dans la base de données (users)
          // and then instead of pushing uid , we push _id
          // and thats all before putting employe inside the object

          // create a function that takes users and employes as arguments
          //  which will check the existence of that employee and also returns the neww employee array orelse itll return an empty array
          let newEmpArray = checkEmployeesMission(users, employees);

          if (
            newEmpArray.length === 0 ||
            newEmpArray.length < employees.length
          ) {
            if (currentUser.role === "responsable") {
              errs.push({
                employees:
                  "Un des employés n'existe pas ou n'appartient pas a votre structure",
              });
            } else errs.push({ employees: "Un des employés n'existe pas" });
            setErrors(errs);
            return;
          } else if (
            currentUser.structure !== mission[8]?.toUpperCase()?.trim()
          ) {
            errs.push({
              missions:
                "Les missions que vous essayez d'introduire ne concernent pas votre structure",
            });
            setErrors(errs);
            return;
          } else {
            missionObject = {
              objetMission: mission[1]?.trim(),
              type: mission[2]?.toLowerCase()?.trim(),
              pays: mission[3]?.toLowerCase()?.trim(),
              destination: mission[4]?.toLowerCase()?.trim(),
              tDateDeb: dateDeb,
              tDateRet: dateFin,
              budget: mission[7] === "empty" ? 0 : parseInt(mission[7]),
              moyenTransport: mission[5]
                ?.split("-")
                .map((item) => item?.toLowerCase()?.trim()),
              moyenTransportRet: mission[6]
                ?.split("-")
                .map((item) => item?.toLowerCase()?.trim()),
              employes: newEmpArray,
              structure: mission[8]?.toUpperCase()?.trim(),
            };

            let object = {
              type: "import",
              users,
              missions: missions.filter(
                (mission) =>
                  mission.etat !== "annulée" &&
                  mission.etat !== "terminée" &&
                  mission.etat !== "refusée"
              ),
            };

            if (
              Object.keys(validateMission(missionObject, currentUser, object))
                .length !== 0
            ) {
              errs.push([
                ...errors,
                validateMission(missionObject, currentUser, object),
              ]);
            } else allMissions.push(missionObject);
          }

          break;
        }
      }
    }
    setErrors(errs);
    if (errs.length !== 0) {
      setSuccess(false);
    } else {
      allMissions.map((m) => {
        callApi("post", "/mission", m);
      });
      allMissions = [];
      setErrors([]);
      setSuccess(true);
    }
  };

  return (
    <div className="upload">
      <div className="description">
        ou importer rapidement plusieurs missions à partir d'un fichier.
      </div>
      <div className="upload-container">
        <div className="file-input-container">
          <input
            type="file"
            id="file-input"
            className="file-input"
            onChange={handleFileChange}
          />
          <label htmlFor="file-input" className="file-input-label">
            {fileName || "aucun fichier choisi"}
          </label>
          <span className="file-input-filename"></span>
        </div>
        <button className="upload-btn" onClick={handleUpload}>
          Importer
        </button>
      </div>
      {success && (
        <div className="success-message">Chargement de données avec succés</div>
      )}
      {errors.length > 0 && <ErrorMessages errors={errors} />}
      {/* {errors.length > 0 && (
        <div className="error-message">
          {/* Désolé, votre fichier de données contient des erreurs. Veuillez
            vérifier les points suivants: 
          <ul>
            <li>
              Assurez-vous que tous les champs obligatoires sont remplis.
              Certains champs peuvent manquer.{" "}
            </li>
            <li>
              Vérifiez qu'aucun des missionnaires n'a déjà des missions prévues
              à la même période. Il y a peut-être un conflit d'horaire.{" "}
            </li>
            <li>Corrigez les erreurs et importer à nouveau le fichier.</li>
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default UploadM;
