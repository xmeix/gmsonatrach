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
    // e.target.files[0] = null;
  }, []);

  useEffect(() => {
    if (!jsonData) return;
    else {
      extractPlanningData();
      extractMissionData();
    }
  }, [jsonData]);

  useEffect(() => {
    if (!planningData || !planningDates || !missionData) return;
    else createMissions();
  }, [missionData, planningData, planningDates]);

  useEffect(() => {
    if (!planningData) return;
    else getPlanningDates();
  }, [planningData]);

  const createMissions = () => {
    // console.log(planningDates);
    // console.log(planningData);
    // console.log(missionData);

    //first we will loop through mission data and we will collect all its info ,
    // and then we will look for all the dates availables and then for each dateDeb ,
    // dateFin we will look for all employees that have the same misions the same dates

    const allMissions = [];
    // loop through mission
    for (let i = 1; i < missionData.length; i++) {
      let mission = missionData[i];
      let dateDeb;
      let dateFin;
      let employees = [];

      // loop through employees(planning)
      // get employee-ids for each mission
      for (let j = 2; j < planningData.length; j++) {
        const element = planningData[j];
        if (element.includes(mission[0])) {
          // console.log({ idUser: element[0], mission: mission });
          employees.push(element[0].trim());
        }
      }

      //get dates for each mission
      for (let i = 2; i < planningData.length; i++) {
        const element = planningData[i];
        if (element.includes(mission[0])) {
          const indDeb = element.indexOf(mission[0]);
          const jD = planningData[1][indDeb];

          console.log([mission[0], getDay(jD, indDeb)]);
          for (let r = indDeb; r < element.length; r++) {
            let s = element[r];

            if (s !== mission[0]) {
              console.log(s);
              const indFin = r - 1;
              const jF = planningData[1][indFin];
              console.log(jF, indFin, getDay(jF, indFin));
              console.log([mission[0], jF, indFin]);
              break;
            }
          }
        }
      }

      // console.log(employees);

      // console.log(mission);
    }
  };

  const getDay = (j, ind) => {
    const d = planningDates
      ?.filter((e) => e[1] <= ind && ind <= e[2])
      ?.map((e) => e);
    // console.log(d[0]);
    // const [month, year] = d[0][0]?.split("/");
    // const date = new Date(year, month, j);
    return d[0][0];
  };

  const extractMissionData = () => {
    const subset = jsonData
      .slice(1)
      .filter((row) => row.length > 0 && row[0])
      .map((row) => row.slice(0, 8));

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
          let k = 0;
          if (el !== "empty") {
            k = planningData[1][i];
            const [month, year] = el.split("/");
            const date = new Date(year, month, 1);
            date.setHours(-1); // Sets the date to the last day of the previous month

            const numDays = date.getDate();

            // return [date, indexDebut, indexFin];
            console.log([el, i, numDays - k + i]);
            return [el, i, numDays - i];
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
      </div>
    </div>
  );
};

export default UsersDashboard;
