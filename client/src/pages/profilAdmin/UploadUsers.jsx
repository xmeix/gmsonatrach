import { useRef, useState } from "react";
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
import { validateUser } from "../../utils/formFieldsVerifications";

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

const UploadUsers = () => {
  const classes = useStyles();
  const { callApi } = useAxios();

  const [errors, setErrors] = useState([]);
  const { users, demandes, user } = useSelector(({ auth }) => auth);
  const [success, setSuccess] = useState(false);
  const { jsonData, handleFileChange, clearData } = useUpload();
  const [usersData, setUsersData] = useState([]);

  const resetState = () => {
    setErrors([]);
    setSuccess(false);
    setUsersData([]);
  };
  const handleUpload = () => {
    resetState();
    if (jsonData) {
      const subset = jsonData
        .slice(1)
        .filter((row) => row.length > 0 && row[0])
        .map((row) => row.slice(0, 6));
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

      console.log(subset);
      setUsersData(arr);
    } else alert("Vous n'avez pas sélectionné de fichier");
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
      {errors.length === 0 && usersData.length > 0 && (
        <div style={{ overflow: "scroll", width: "80vw" }}>
          <Table className={usersData.length > 0 ? classes.table2 : ""}>
            <TableHead>
              <TableRow>
                {usersData[0]?.map((item, i) => (
                  <TableCell key={i} className={classes.tableCell2}>
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {usersData?.slice(1).map((subArray, i) => (
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
      )}
    </div>
  );
};

export default UploadUsers;
