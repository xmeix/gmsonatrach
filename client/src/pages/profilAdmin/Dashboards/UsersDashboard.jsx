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
        // const sheets = workbook.SheetNames;

        // if (sheets.length) {
        //   const rows = utils.sheet_to_json(workbook.Sheets[sheets[0]]);
        //   setJsonData(rows);
        // }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const newJsonData = utils.sheet_to_json(worksheet, { header: 1 });
        setJsonData(newJsonData);
        console.log(newJsonData);
      } catch (error) {
        console.log("Error processing the file. Please try again.", error);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  useEffect(() => {
    if (!jsonData) {
      return;
    }
    extractMissionData();
    extractDates();
  }, [jsonData]);

  const extractMissionData = () => {
    const subset = jsonData
      .slice(1)
      .filter((row) => row.length > 0 && row[0])
      .map((row) => row.slice(0, 8));

    setMissionData(subset);

    console.log(missionData[0]);
  };
  const extractDates = () => {
    const longestRow = jsonData
      .slice(12)
      .map((row) => row.slice(10))
      .reduce((acc, row) => {
        return row.length > acc.length ? row : acc;
      }, []);
    console.log(longestRow);

    const subset = jsonData.slice(12).map((row, i) => {
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
    console.log(ew);
    setPlanningData(ew);
  };
  return (
    <div className="usersDashboard">
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
