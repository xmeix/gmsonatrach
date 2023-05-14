import { useState } from "react";
import "./UploadMissions.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { useUpload } from "../../hooks/useUpload";
import { useAxios } from "../../hooks/useAxios";
import {
  ExcelDateToJSDate,
  validateDB,
  verifyDuplicates,
} from "../../utils/formFieldsVerifications";

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

const ErrorMessages = ({ errors }) => (
  <div className="error-message">
    <ul>
      <li>
        Assurez-vous que tous les champs obligatoires sont remplis. Certains
        champs peuvent manquer.
      </li>
      <li>
        Vérifiez qu'il n'y a pas déja des demandes soumises prévues à une même
        période pour les memes employés. Il y a peut-être un conflit.
      </li>
      <li>Corrigez les erreurs et importer à nouveau le fichier.</li>
      {/* {errors.map((error, index) => (
        <li key={index}>{JSON.stringify(error)}</li>
      ))} */}
    </ul>
  </div>
);

const UploadDB = () => {
  const classes = useStyles();
  const { callApi } = useAxios();

  const [errors, setErrors] = useState([]);
  const { users, demandes, user } = useSelector(({ auth }) => auth);
  const [success, setSuccess] = useState(false);
  const { jsonData, handleFileChange, clearData } = useUpload();
  const [dbs, setDbs] = useState([]);

  const handleUpload = () => {
    setErrors([]);
    const subset = jsonData
      .slice(1)
      .filter((row) => row.length > 0 && row[0])
      .map((row) => row.slice(0, 19));
    let arr = [];
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
      arr = [...arr, n];
    }

    const data = arr.slice(1).map((e) => {
      let dbObject = {
        index: e[0],
        motif: e[1] !== "empty" ? e[1] : "",
        numSC: e[18] !== "empty" ? e[18] : "",
        designationSC: e[17] !== "empty" ? e[17] : "",
        montantEngage: e[16] !== "empty" ? e[16] : "",
        nature: e[15],
        motifDep: e[11],
        observation: e[10] !== "empty" ? e[10] : "",
        dateDepart: ExcelDateToJSDate(e[2]),
        dateRetour: ExcelDateToJSDate(e[3]),
        depart: e[14],
        destination: e[13],
        paysDestination: e[12],
        direction: e[9] !== "empty" ? e[9] : "",
        sousSection: e[8] !== "empty" ? e[8] : "",
        division: e[7] !== "empty" ? e[7] : "",
        base: e[6] !== "empty" ? e[6] : "",
        gisement: e[5] !== "empty" ? e[5] : "",
        employes: [...new Set(e[4]?.replace(/#/g, "")?.split(","))],
      };
      return dbObject;
    });
    
    // const object = {
    //   type: "import",
    //   users,
    //   demandes: demandes
    //     .filter((d) => d.etat !== "annulée" || d.etat !== "refusée")
    //     .map((d) => d),
    // };


    // const duplicateErrors = verifyDuplicates(data);
    // const errs = [];
    // data.flatMap((d) => {
    //   const validationErrors = validateDB(d, user, object);
    //   if (Object.keys(validationErrors).length !== 0) {
    //     errs.push(validationErrors);
    //   }
    // });
    // if (duplicateErrors.length > 0 || errs.length > 0) {
    //   const errors = [...duplicateErrors, ...errs];
    //   setErrors(errors);
    //   setSuccess(false);
    // } else {
    //   data.forEach((d) => callApi("post", "/demande/DB", d));
    //   setErrors([]);
    //   setSuccess(true);
    //   setDbs(arr);
    // }
  };

  return (
    <div className="upload">
      <div className="description">
        ou importer rapidement plusieurs demandes a partir d'un fichier.
      </div>
      <div className="upload-container">
        <input
          type="file"
          className="upload-input"
          onChange={handleFileChange}
        />
        <button className="upload-btn" onClick={handleUpload}>
          Importer
        </button>
      </div>
      {success && (
        <div className="success-message">Chargement de données avec succés</div>
      )}
      {errors.length > 0 && <ErrorMessages errors={errors} />}
      {/* {errors.length === 0 && dbs.length > 0 && (
        <div style={{ overflow: "scroll", width: "80vw" }}>
          <Table className={dbs.length > 0 ? classes.table2 : ""}>
            <TableHead>
              <TableRow>
                {dbs[0]?.map((item, i) => (
                  <TableCell key={i} className={classes.tableCell2}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dbs?.slice(1).map((subArray, i) => (
                <TableRow key={i}>
                  {subArray.map((item, j) => (
                    <TableCell
                      key={j}
                      className={classes.tableCell2}
                      style={{ width: "50px" }}
                    >
                      {item !== "empty" ? item : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )} */}
    </div>
  );
};

export default UploadDB;
