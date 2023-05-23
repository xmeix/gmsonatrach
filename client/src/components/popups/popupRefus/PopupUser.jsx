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
});

const PopupUser = ({ item, close }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state.auth);
  const [handleClick] = useBtn();
  const [newItem, setNewItem] = useState({});
  const [updatedItem, setUpdatedItem] = useState(item);
  const [editMode, setEditMode] = useState(false);

  const OmLabelLine = ({ label, content }) => (
    <div className="om-label-line">
      <div className="om-label">{label}</div>
      <div className="om-content" style={{ flex: 1 }}>
        {content}
      </div>
    </div>
  );

  const data = [
    { label: "matricule", content: `${updatedItem._id}` },
    { label: "role", content: `${updatedItem.role}` },
    { label: "etat", content: `${updatedItem.etat || "/"}` },
    { label: "nom", content: `${updatedItem.nom}` },
    { label: "prénom", content: `${updatedItem.prenom}` },
    { label: "structure", content: `${updatedItem.structure}` },
    { label: "fonction", content: `${updatedItem.fonction}` },
    { label: "email", content: `${updatedItem.email}` },
    { label: "numero de téléphone", content: `${updatedItem.numTel}` },
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

  // const handleInputChange = (label, value) => {
  //   setNewItem({ ...newItem, [label]: value });
  // };
  const handleInputChange = (label, value) => {
    setNewItem((prevItem) => ({ ...prevItem, [label]: value }));
  };

  const handleOkClick = () => {
    console.log("altering");
    handleClick("update", item, "user", "", newItem);
    const [[key, value]] = Object.entries(newItem);
    console.log(key);
    console.log(value);
    setUpdatedItem({ ...item, [key]: value });
    setEditMode((prev) => (prev === key ? true : key));
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
                      {el.label}
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
                                  onBlur={() => handleEditMode(false)}
                                />{" "}
                                <button onClick={handleOkClick}>OK</button>
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
