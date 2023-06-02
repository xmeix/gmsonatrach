import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Select from "react-select";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import { useSelector } from "react-redux";
import useBtn from "../../../hooks/useBtn";
import "./../Popup.css";
const useStyles = makeStyles({
  table2: {
    borderCollapse: "collapse",
    border: "none",
  },
  tableCell1: {
    padding: "10px",
    fontWeight: 700,
    fontSize: 12,
    flexBasis: "50%",
    fontFamily: "Montserrat",
    boxShadow: "none",
    border: "none",
  },
  tableCell2: {
    padding: "10px",
    fontWeight: 500,
    fontSize: 11,
    border: "none",
    flexBasis: "50%",
    fontFamily: "Montserrat",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px black",
    borderBottom: "none",
    "&:last-child": {
      borderBottom: "solid 1px black",
    },
  },
  success: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1em",
    borderTop: "solid 1px black",
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
  const [success, setSuccess] = useState(false);
  const data = [
    { label: "matricule", content: `${updatedItem.uid}` },
    { label: "role", content: `${updatedItem.role}` },
    { label: "etat", content: `${updatedItem.etat || "/"}` },
    { label: "nom", content: `${updatedItem.nom}` },
    { label: "prenom", content: `${updatedItem.prenom}` },
    { label: "structure", content: `${updatedItem.structure}` },
    { label: "fonction", content: `${updatedItem.fonction}` },
    { label: "numTel", content: `${updatedItem.numTel}` },
    { label: "email", content: `${updatedItem.email}` },
    { label: "password", content: `${updatedItem.password}` },
  ];

  const handleEditMode = (label) => {
    setNewItem({});
    setEditMode((prev) => (prev === label ? false : label));
  };

  const allowedRoles = [
    { value: "employe", label: "Employe" },
    { value: "secretaire", label: "Secretaire" },
    { value: "responsable", label: "Responsable" },
    { value: "directeur", label: "Directeur" },
  ].filter((role) => {
    if (user.role === "responsable") {
      return role.value === "employe" || role.value === "secretaire";
    } else if (user.role === "directeur") {
      return (
        role.value === "employe" ||
        role.value === "secretaire" ||
        role.value === "responsable" ||
        role.value === "relex"
      );
    }
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
    setSuccess(false);
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
        setUpdatedItem((prevItem) => ({ ...prevItem, [key]: value }));
        setEditMode((prev) => (prev === key ? true : key));
        handleClick("update", item, "user", "", newItem);
        setErrors({});
        setSuccess(true);
      } else {
        setSuccess(false);
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
      errs[label] = "non valide";
    } else if (
      label === "email" &&
      !/^[a-zA-Z0-9]+([.][a-zA-Z0-9]+)*@sonatrach\.dz$/.test(content)
    ) {
      errs.email = "non valide.";
    } else if (label === "numTel" && !/^(0)(5|6|7)[0-9]{8}$/.test(content)) {
      errs.numTel = "non valide.";
    }

    return errs;
  };

  // useEffect(() => {
  //   console.log(updatedItem);
  // }, [updatedItem]);
  console.log(data);
  return (
    <div className="popup-user">
      <div className="title">Profile</div>
      <div className="sub-title">
        {updatedItem.nom} {updatedItem.prenom}
      </div>

      <TableContainer>
        <Table className={classes.table2}>
          <TableBody>
            {data.map((el, i) => {
              if (el.label === "etat" && updatedItem.role === "employe") {
                return null;
              }
              if (
                (updatedItem.role === "secretaire" ||
                  updatedItem.role === "relex") &&
                el.label === "structure"
              )
                return null;
              if (el.label !== "etat") {
                return (
                  <TableRow key={i} className={classes.tableRow}>
                    <TableCell className={classes.tableCell1}>
                      {el.label === "numTel"
                        ? "tel"
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
                              <div className="user-form-box">
                                <div className="user-input-box">
                                  <input
                                    className={`${classes.inputField} user-input`}
                                    defaultValue={
                                      el.label !== "password"
                                        ? el.content
                                        : "******"
                                    }
                                    type={
                                      el.label === "password"
                                        ? "password"
                                        : "text"
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        el.label,
                                        e.target.value
                                      )
                                    }
                                    // onBlur={() => handleEditMode(false)}
                                  />
                                  {errors[el.label] && (
                                    <div className="input-error">
                                      {errors[el.label]}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={handleOkClick}
                                  className="user-btn width"
                                >
                                  <CheckRoundedIcon className="icon" />
                                </button>
                              </div>
                            ) : (
                              <div className="user-form-box">
                                <div className="user-input-box">
                                  <Select
                                    className={`${classes.select} select`}
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
                                  {errors[el.label] && (
                                    <div className="input-error">
                                      {errors[el.label]}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={handleOkClick}
                                  className="user-btn width"
                                >
                                  <CheckRoundedIcon className="icon" />
                                </button>
                              </div>
                            )
                          ) : (
                            <div
                              onClick={() => handleEditMode(el.label)}
                              className="edit-box"
                            >
                              {el.label !== "password" ? el.content : "******"}
                              <ModeEditRoundedIcon className="icon" />
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
            {success && (
              <TableRow className={classes.success}>
                <div className="success-message">modification avec succés.</div>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PopupUser;
