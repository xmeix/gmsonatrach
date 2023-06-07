import { useEffect, useState } from "react";
import { useUpload } from "../../hooks/useUpload";

import "./UploadMissions.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
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

const UploadM = () => {
  const classes = useStyles();
  const [missionData, setMissionData] = useState([]);
  const { jsonData, handleFileChange, fileName } = useUpload();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const handleUpload = () => {
    // Logic for handling the upload
  };

  const getPlanningDates = (planningData) => {
    if (!planningData) return;
    else {
      console.log("here");

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
        setErrors({
          file: "Les dates sur le calendrier ne sont pas en ordre croissant ou ne sont pas consécutives",
        });
        return;
      } else {
        const dates = planningData[0]
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

        const datesHaveValidDays = dates.map((d) => {
          const [month, year] = d[0].split("/");
          const date = new Date(year, month, 0);
          console.log(date);
          const startIndex = d[1];
          const endIndex = d[2];
          const subArray = planningData[1]
            .slice(startIndex, endIndex + 1)
            .filter((el) => el !== "empty");
          console.log(d[0]);
          // console.log(subArray);
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
          setErrors({
            file: "le calendrier ne contient pas des jours consécutives valides",
          });
          return;
        } else {
          setErrors({});
        }
      }
    }
  };

  const extractPlanningData = () => {
    const longestRow = jsonData?.slice(12).reduce((acc, row) => {
      return row.length > acc.length ? row : acc;
    }, []);

    const subset = jsonData?.slice(11).map((row) => {
      return row
        .slice(10, longestRow.length)
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

    // setPlanningData(newData);
    if (newData) {
      console.log(newData);
      getPlanningDates(newData);
    }
  };
  const extractMissionData = () => {
    const subset = jsonData
      .slice(1)
      .filter((row) => row.length > 0 && row[0])
      .map((row) => row.slice(0, 9));

    setMissionData(subset);
  };
  useEffect(() => {
    if (jsonData) {
      console.log(fileName);
      setErrors({});
      if (
        jsonData[0][0] !== "Informations nécessaire sur les missions de travail"
      ) {
        setErrors({ file: "veuillez introduire format correcte" });
      } else {
        extractPlanningData();
      }
    }
  }, [jsonData]);

  return (
    <div className="upload">
      <div className="description">
        ou importer rapidement plusieurs missions à partir d'un fichier.
      </div>
      <div className="upload-container">
        <div class="file-input-container">
          <input
            type="file"
            id="file-input"
            class="file-input"
            onChange={handleFileChange}
          />
          <label for="file-input" class="file-input-label">
            {fileName || "aucun fichier choisi"}
          </label>
          <span class="file-input-filename"></span>
        </div>
        <button className="upload-btn" onClick={handleUpload}>
          Importer
        </button>
      </div>
      {/* <div style={{ overflow: "scroll", width: "80vw" }}>
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
                  {item !== "empty" ? item : ""}
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
      </div> */}
    </div>
  );
};

export default UploadM;
