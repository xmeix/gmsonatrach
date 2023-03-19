import "./Formulaire.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import useForm from "../../hooks/useForm";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useAxios } from "../../hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid var(--light-gray)",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.1);",
    "&:hover": {
      border: "1px solid var(--light-gray)",
    },
    "&:focus": {
      border: "1px solid var(--light-gray)",
    },
  }),
};

const Formulaire = ({ title, entries, buttons, type }) => {
  const { callApi, error, isLoading, successMsg } = useAxios();
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedRole, setSelectedRole] = useState("");
  const dispatch = useDispatch();
  const [values, handleChange, resetForm] = useForm(() => {
    const vals = {};
    entries.forEach((entry) => {
      vals[entry.id] = "";
    });
    delete vals[""]; // remove empty string key
    return vals;
  });

  /***----------------------------------------------------------- */
  const missions = useSelector((state) => state.auth.missions);
  const users = useSelector((state) => state.auth.users);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [updatedEntries, setUpdatedEntries] = useState(entries); // new state variable

  const [employeesNonMissionnaires, setEmployeesNonMissionnaires] = useState(
    []
  );
  useEffect(() => {
    console.log("jere");
    let newEmployeesNonMissionnaires;
    if (start && end && (type === "mission" || type === "DB")) {
      console.log("hereee");
      newEmployeesNonMissionnaires = users
        .filter(
          (user) =>
            user.role === "employe" &&
            !missions.some(
              (mission) =>
                mission.employes.includes(user._id) &&
                mission.etat === "acceptée" &&
                mission.tDateDeb <= end &&
                mission.tDateRet >= start
            )
        )
        .map((user) => ({
          label: user.nom + " " + user.prenom,
          value: user._id,
        }));

      console.log(newEmployeesNonMissionnaires);

      setEmployeesNonMissionnaires(newEmployeesNonMissionnaires);
      console.log(newEmployeesNonMissionnaires);
      let newEntries;
      if (type === "mission") {
        newEntries = entries.map((entry) => {
          if (entry.id === "employes")
            entry.options = newEmployeesNonMissionnaires;
          return entry;
        });
      } else if (type === "DB") {
        newEntries = entries.map((entry) => {
          if (entry.id === "employes")
            entry.options = newEmployeesNonMissionnaires;
          return entry;
        });
      }
      if (newEntries) {
        setUpdatedEntries(newEntries);
      }
    }
  }, [start, end, entries, missions, type, users]);

  /***-----------------------------------------------------------*/
  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedRole("");
    switch (type) {
      case "user":
        {
          //register(values);
          callApi("post", "/auth/register", values);
        }
        break;
      case "mission":
        {
          //register(values);
          callApi("post", "/mission", values);
        }
        break;
      case "DB":
        {
          //register(values);
          callApi("post", "/demande/DB", values);
        }
        break;
      case "DC":
        {
          //register(values);
          callApi("post", "/demande/DC", values);
        }
        break;
      case "DM":
        {
          //register(values);
          callApi("post", "/demande/DM", values);
        }
        break;
      default:
        console.log("errrr");
    }
  };
  return (
    <div className="formulaire">
      <div className="listTitle">{title}</div>
      <div className="inputs">
        {updatedEntries.map((entry, i) => {
          return (
            <div className="inputGroup" key={i}>
              {!(
                currentUser.role === "secretaire" &&
                entry.id === "role" &&
                type === "user"
              ) &&
                !(
                  currentUser.role === "responsable" &&
                  entry.id === "structure" &&
                  type === "mission"
                ) &&
                !(
                  (currentUser.role === "responsable" ||
                    currentUser.role === "directeur") &&
                  entry.id === "structure" &&
                  selectedRole !== "employe" &&
                  selectedRole !== "responsable" &&
                  type === "user"
                ) && <label htmlFor={entry.label}>{entry.label}</label>}

              {entry.inputType !== "textArea" &&
                entry.inputType !== "select" &&
                entry.inputType !== "create-select" && (
                  <input
                    type={entry.inputType}
                    min={entry.inputType === "number" ? 0 : 0}
                    onChange={(e) => {
                      if (type === "mission") {
                        if (entry.id === "tDateDeb") {
                          setStart(e.target.value);
                        } else if (entry.id === "tDateRet") {
                          setEnd(e.target.value);
                        }
                      } else if (type === "DB") {
                        if (entry.id === "dateDepart") {
                          setStart(e.target.value);
                        } else if (entry.id === "dateRetour") {
                          setEnd(e.target.value);
                        }
                      }
                      handleChange(e);
                    }}
                    name={entry.id}
                  />
                )}
              {entry.inputType === "create-select" && (
                <CreatableSelect
                  className="select"
                  options={entry.options}
                  isMulti={entry.isMulti}
                  placeholder={entry.label}
                  styles={customStyles}
                  onChange={(selectedOption) =>
                    handleChange({
                      target: { name: entry.id, value: selectedOption },
                    })
                  }
                />
              )}
              {entry.inputType === "select" &&
                !(
                  currentUser.role === "secretaire" &&
                  entry.id === "role" &&
                  type === "user"
                ) &&
                !(
                  currentUser.role === "responsable" &&
                  entry.id === "structure" &&
                  type === "mission"
                ) &&
                !(
                  (currentUser.role === "responsable" ||
                    currentUser.role === "directeur") &&
                  entry.id === "structure" &&
                  selectedRole !== "employe" &&
                  selectedRole !== "responsable" &&
                  type === "user"
                ) && (
                  <Select
                    className="select"
                    options={
                      entry.id === "role" &&
                      currentUser.role === "responsable" &&
                      type === "user"
                        ? [
                            { value: "employe", label: "Employe" },
                            { value: "secretaire", label: "Secretaire" },
                          ]
                        : entry.options
                    }
                    isMulti={entry.isMulti}
                    placeholder={entry.label}
                    styles={customStyles}
                    onChange={(selectedOption) => {
                      if (
                        (currentUser.role === "responsable" ||
                          currentUser.role === "directeur") &&
                        entry.id === "role" &&
                        type === "user" &&
                        (selectedOption.value === "employe" ||
                          selectedOption.value === "directeur" ||
                          selectedOption.value === "responsable" ||
                          selectedOption.value === "relex" ||
                          selectedOption.value === "secretaire")
                      ) {
                        setSelectedRole(selectedOption.value);
                      }
                      handleChange({
                        target: { name: entry.id, value: selectedOption },
                      });
                    }}
                  />
                )}

              {entry.inputType === "textArea" && (
                <textarea
                  rows={5}
                  cols={7}
                  onChange={handleChange}
                  name={entry.id}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="buttons">
        {buttons.map((btn, index) => {
          return (
            <button
              className="formBtn"
              key={index}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {btn.title}
            </button>
          );
        })}
      </div>
      {error !== "" && (
        <div className="error-message">
          <ErrorIcon className="icn" />
          {error}
        </div>
      )}
      {successMsg !== "" && (
        <div className="success-message">
          <CheckCircleRoundedIcon className="icn" />
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default Formulaire;
