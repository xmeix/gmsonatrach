import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import Select from "react-select";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import { useSelector } from "react-redux";
import useBtn from "../../../hooks/useBtn";

const useStyles = makeStyles({
  table2: {
    borderCollapse: "separate",
    border: "none",
  },
  tableCell2: {
    padding: "10px",
    fontWeight: 500,
    fontSize: 13,
    border: "none",
  },
  inputField: {
    // Add your input field styles here
  },
  select: {
    // Add your select styles here
  },
  error: {
    color: "red",
    fontSize: 12,
  },
});

const PopupUser = ({ item, close }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);
  const [handleClick] = useBtn();
  const [newItem, setNewItem] = useState({});
  const [updatedItem, setUpdatedItem] = useState(item);
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const data = [
    { label: "matricule", content: `${updatedItem._id}` },
    { label: "role", content: `${updatedItem.role}` },
    { label: "etat", content: `${updatedItem.etat || "/"}` },
    { label: "nom", content: `${updatedItem.nom}` },
    { label: "prenom", content: `${updatedItem.prenom}` },
    { label: "structure", content: `${updatedItem.structure}` },
    { label: "fonction", content: `${updatedItem.fonction}` },
    { label: "email", content: `${updatedItem.email}` },
    { label: "numTel", content: `${updatedItem.numTel}` },
  ];

  const handleEditMode = (label) => {
    setNewItem({});
    setEditMode((prev) => (prev === label ? false : label));
  };

  const allowedRoles = [
    { label: "employe", value: "employe" },
    { label: "secretaire", value: "secretaire" },
    { label: "responsable", value: "responsable" },
    { label: "directeur", value: "directeur" },
  ].filter((role) => {
    if (user.role === "secretaire" && role.value === "employe") return true;
    if (
      user.role === "responsable" &&
      (role.value === "secretaire" || role.value === "employe")
    )
      return true;
    if (user.role === "directeur") return true;
    return false;
  });

  const allowedStructures = [
    { label: "PMO", value: "PMO" },
    { label: "FIN", value: "FIN" },
    { label: "SD", value: "SD" },
    { label: "PRC", value: "PRC" },
    { label: "HCM", value: "HCM" },
    { label: "MRO", value: "MRO" },
    { label: "IPM", value: "IPM" },
    { label: "PDN", value: "PDN" },
    { label: "TECH", value: "TECH" },
    { label: "DATA", value: "DATA" },
    { label: "CHANGE", value: "CHANGE" },
  ].filter((structure) => {
    if (user.role === "responsable") return false;
    if (user.role === "directeur" || user.role === "secretaire") return true;
    return false;
  });

  const handleInputChange = (label, value) => {
    setNewItem({ ...newItem, [label]: value });
    console.log(newItem);
  };

  const handleOkClick = (e) => {
    e.preventDefault();
    if (Object.keys(newItem).length > 0) {
      const [[key, value]] = Object.entries(newItem);
      const errs = handleVerification(key, value);
      //errors is an object
      if (Object.keys(errs).length <= 0) {
        setUpdatedItem({ ...item, [key]: value });
        setEditMode((prev) => (prev === key ? true : key));
        handleClick("update", item, "user", "", newItem);
        setErrors({});
      } else {
        setErrors(errs);
      }
    }
  };

  const handleVerification = (label, content) => {
    //check for empty fields and also if they have any special caracters
    //if its email or numtel : verify regex
    const errs = {};
    //if content is empty or contains special caracters (email allowed to have @ and . other than that no) then return err
    if (
      content === "" ||
      (content.match(/[^a-zA-Z0-9 ]/) &&
        label !== "numTel" &&
        label !== "email")
    ) {
      errs[label] = "Veuillez renseigner un champ valide";
    } else if (
      label === "email" &&
      !/^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*@sonatrach\.dz$/.test(content)
    ) {
      errs.email = "L'email doit être valide.";
    } else if (label === "numTel" && !/^(0)(5|6|7)[0-9]{8}$/.test(content)) {
      errs.numTel = "Le numéro de téléphone doit être valide.";
    }

    return errs;
  };

  useEffect(() => {
    console.log(updatedItem);
  }, [updatedItem]);

  return (
    <div className="popup-user">
      <div className="title">
        Profile: {updatedItem.nom} {updatedItem.prenom}
      </div>

      <TableContainer>
        <Table className={classes.table2}>
          <TableBody>
            {data.map((el, i) => {
              if (el.label === "etat" && updatedItem.role === "employe") {
                return null;
              }
              if (el.label !== "etat") {
                return (
                  <TableRow key={i}>
                    <TableCell className={classes.tableCell2}>
                      {el.label === "numTel"
                        ? "numero de téléphone"
                        : el.label === "prenom"
                        ? "prénom"
                        : el.label}
                    </TableCell>
                    <TableCell className={classes.tableCell2}>
                      {el.label !== "matricule" &&
                      !(
                        user.role === "responsable" && el.label === "structure"
                      ) &&
                      !(user.role === "secretaire" && el.label === "role") ? (
                        <>
                          {editMode === el.label ? (
                            el.label !== "structure" && el.label !== "role" ? (
                              <>
                                {" "}
                                <input
                                  className={classes.inputField}
                                  defaultValue={el.content}
                                  onChange={(e) =>
                                    handleInputChange(el.label, e.target.value)
                                  }
                                  // onBlur={() => handleEditMode(false)}
                                />{" "}
                                <button onClick={handleOkClick}>OK</button>{" "}
                                {errors[el.label] && (
                                  <div className={classes.error}>
                                    {errors[el.label]}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <Select
                                  className={classes.select}
                                  options={
                                    el.label === "structure"
                                      ? allowedStructures
                                      : el.label === "role"
                                      ? allowedRoles
                                      : []
                                  }
                                  onChange={(selectedOption) =>
                                    handleInputChange(
                                      el.label,
                                      selectedOption.value
                                    )
                                  }
                                />
                                <button onClick={handleOkClick}>OK</button>
                                {errors[el.label] && (
                                  <div className={classes.error}>
                                    {errors[el.label]}
                                  </div>
                                )}
                              </>
                            )
                          ) : (
                            <div onClick={() => handleEditMode(el.label)}>
                              {el.content}
                              <ModeEditRoundedIcon className="icn" />
                            </div>
                          )}
                        </>
                      ) : (
                        el.content
                      )}
                    </TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PopupUser;
