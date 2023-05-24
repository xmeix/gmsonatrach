import "./Formulaire.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import useForm from "../../hooks/useForm";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../../hooks/useAxios";
import {
  validateDB,
  validateMission,
  validateUser,
} from "../../utils/formFieldsVerifications";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid var(--light-gray)",
    boxShadow: "0px 1px 4px rgb(0 0 0 / 40%)",
    "&:hover": {
      border: "1px solid var(--light-gray)",
    },
    "&:focus": {
      border: "1px solid var(--light-gray)",
    },
  }),
};

const Formulaire = ({ title, entries, buttons, type }) => {
  const selectInputRef = useRef();
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
  const [errors, setErrors] = useState({});
  const onClear = () => {
    selectInputRef.current.setValue(null);
  };
  /***----------------------------------------------------------- */
  const { missions, demandes } = useSelector((state) => state.auth || []);
  const users = useSelector((state) => state.auth.users);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [updatedEntries, setUpdatedEntries] = useState(entries); // new state variable
  const [disabled, setDisabled] = useState(true); // new state variable

  useEffect(() => {
    let newEmployeesNonMissionnaires;
    if (start && end && (type === "mission" || type === "DB")) {
      newEmployeesNonMissionnaires = users
        .filter(
          (user) =>
            user.role === "employe" &&
            !missions.some(
              (mission) =>
                mission.employes.some((u) => u._id === user._id) &&
                (mission.etat === "en-cours" || mission.etat === "acceptée") &&
                mission.tDateRet > start &&
                mission.tDateDeb < end
            )
        )
        .map((user) => ({
          label: user.nom + " " + user.prenom,
          value: user._id,
        }));

      let newEntries;
      if (type === "mission") {
        newEntries = entries.map((entry) => {
          if (entry.id === "employes") {
            entry.options = newEmployeesNonMissionnaires;
            onClear();
          }
          return entry;
        });
      } else if (type === "DB") {
        newEntries = entries.map((entry) => {
          if (entry.id === "employes") {
            entry.options = newEmployeesNonMissionnaires;
            onClear();
          }
          return entry;
        });
      }
      if (newEntries) {
        setUpdatedEntries(newEntries);
        setDisabled(false);
      } else {
        setUpdatedEntries([]);
        setDisabled(true);
      }
    }
  }, [start, end, entries, missions, type, users]);
  // resetForm(() => {
  //   const vals = {};
  //   entries.forEach((entry) => {
  //     vals[entry.id] = "";
  //   });
  //   delete vals[""]; // remove empty string key
  //   return vals;
  // });
  /***-----------------------------------------------------------*/
  const handleSubmit = (e) => {
    e.preventDefault();
    // setSelectedRole("");
    switch (type) {
      case "user":
        {
          //register(values);

          setErrors(validateUser(values));
          if (Object.keys(validateUser(values)).length === 0) {
            callApi("post", "/auth/register", values);
            setErrors({});
          }
        }
        break;
      case "mission":
        {
          //register(values);
          let object = {
            type: "form",
            users,
            missions,
          };
          setErrors(validateMission(values, currentUser, object));
          if (
            Object.keys(validateMission(values, currentUser, object)).length ===
            0
          ) {
            callApi("post", "/mission", values);
            setErrors({});
          }
        }
        break;
      case "DB":
        {
          //register(values);
          let object = {
            type: "form",
            users,
            demandes: demandes.filter((d) => d.__t === "DB").map((d) => d),
          };
          setErrors(validateDB(values, currentUser, object));
          if (
            Object.keys(validateDB(values, currentUser, object)).length === 0
          ) {
            callApi("post", "/demande/DB", values);
          }
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

              {entry.inputType !== "textarea" &&
                entry.inputType !== "select" &&
                entry.inputType !== "create-select" && (
                  <input
                    placeholder={entry.placeholder}
                    type={entry.inputType}
                    min={
                      (entry.inputType === "number" && "") ||
                      (entry.inputType === "date" &&
                        new Date().toISOString().split("T")[0]) ||
                      undefined
                    }
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
                  placeholder={entry.placeholder}
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
                    ref={entry.id === "employes" ? selectInputRef : null}
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
                    placeholder={entry.placeholder}
                    styles={customStyles}
                    isDisabled={entry.id === "employes" && disabled}
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

              {entry.inputType === "textarea" && (
                <textarea
                  placeholder={entry.placeholder}
                  rows={5}
                  cols={7}
                  onChange={handleChange}
                  name={entry.id}
                />
              )}
              {errors[entry.id] && (
                <div className="input-error">{errors[entry.id]}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="buttons">
        {buttons.map((btn, index) => {
          if (btn.title === "Annuler") {
            return (
              <button
                className="formBtn"
                key={index}
                onClick={() =>
                  resetForm(() => {
                    const vals = {};
                    entries.forEach((entry) => {
                      vals[entry.id] = "";
                    });
                    delete vals[""]; // remove empty string key
                    return vals;
                  })
                }
                disabled={isLoading}
              >
                {btn.title}
              </button>
            );
          } else
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
