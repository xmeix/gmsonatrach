import "./Formulaire.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import useForm from "../../hooks/useForm";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../../hooks/useAxios";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import {
  validateAIMissionForm,
  validateDB,
  validateDC,
  validateDM,
  validateMission,
  validateUser,
  verifyInclusion,
} from "../../utils/formFieldsVerifications";
import { getBestEmployes } from "../../api/apiCalls/getCalls";
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
const successMessages = {
  4: "La mission introduite présente une perspective favorable d'accomplissement réussi à 90%.",
  3: "La mission introduite présente une perspective favorable d'accomplissement réussi à 75%.",
  2: "La mission introduite présente une perspective favorable d'accomplissement réussi à 50%.",
};

const errorMessages = {
  1: "La mission introduite présente une perspective favorable d'accomplissement réussi à 25%.",
  0: "Il n'est pas assuré que la mission introduite aboutisse à un succès.",
};

const Formulaire = ({ title, entries, buttons, type }) => {
  const selectInputRef = useRef();
  const { callApi, error, setError, isLoading, successMsg, setSuccessMsg } =
    useAxios();
  const currentUser = useSelector((state) => state.auth.user);
  const [selectedRole, setSelectedRole] = useState("");
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
  const { missions } = useSelector((state) => state.mission || []);
  const { demandes } = useSelector((state) => state.demande || []);
  const users = useSelector((state) => state.auth.users);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [updatedEntries, setUpdatedEntries] = useState(entries); // new state variable
  const [disabled, setDisabled] = useState(true); // new state variable
  const [predResult, setPredResult] = useState(null);

  useEffect(() => {
    let newEmployeesNonMissionnaires;
    if (
      start &&
      end &&
      (type === "mission" || type === "DB" || type === "ia-form")
    ) {
      newEmployeesNonMissionnaires = users
        .filter(
          (us) =>
            (us.role === "employe" || us.role === "responsable") &&
            !missions.some(
              (mission) =>
                mission.employes.some(
                  (u) => u._id.toString() === us._id.toString()
                ) &&
                (mission.etat === "en-cours" ||
                  mission.etat === "acceptée" ||
                  mission.etat === "en-attente") &&
                !verifyInclusion(
                  new Date(mission.tDateDeb),
                  new Date(mission.tDateRet),
                  new Date(start),
                  new Date(end)
                )
            )
        )
        .map((us) => ({
          label: us.nom + " " + us.prenom,
          value: us._id,
        }));

      let newEntries;
      if (type === "mission" || type === "ia-form") {
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

  const handlePredict = () => {
    setErrors(validateAIMissionForm(values, currentUser));
    if (Object.keys(validateAIMissionForm(values, currentUser)).length === 0) {
      // data: [structure, type, budget, pays, destination, NbEmployes, duree];
      console.log(Object.entries(values));
      fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: values,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPredResult(parseInt(data.predictions[0]));
          console.log(data.predictions[0]);
        });
      setErrors({});
    }
  };

  const handleGetBestEmployes = () => {
    getBestEmployes("/ticket/employes");
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let validationErrors = {};
    let apiEndpoint = "";
    let dataToSend = {};

    switch (type) {
      case "user":
        validationErrors = validateUser({
          ...values,
          user: currentUser,
          selectedRole: selectedRole,
        });
        apiEndpoint = "/auth/register";
        dataToSend = { ...values, role: selectedRole || "" };
        break;
      case "mission":
        const missionValidationObject = {
          type: "form",
          users,
          missions,
        };
        validationErrors = validateMission(
          values,
          currentUser,
          missionValidationObject
        );
        apiEndpoint = "/mission";
        dataToSend = values;
        break;
      case "DB":
        const dbValidationObject = {
          type: "form",
          users,
          demandes: demandes.filter((d) => d.__t === "DB").map((d) => d),
        };
        validationErrors = validateDB(values, currentUser, dbValidationObject);
        apiEndpoint = "/demande/DB";
        dataToSend = values;
        break;
      case "DC":
        validationErrors = validateDC(values);
        apiEndpoint = "/demande/DC";
        dataToSend = values;
        break;
      case "DM":
        validationErrors = validateDM(values);
        apiEndpoint = "/demande/DM";
        dataToSend = values;
        break;
      default:
        console.log("errrr");
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      callApi("post", apiEndpoint, dataToSend);
      setErrors({});
      // showMessage(successMsg, "success");
    }
  };

  const allowField = (input) => {
    switch (input) {
      case "role":
        if (currentUser.role === "secretaire") return false;
        break;
      case "structure":
        if (currentUser.role === "responsable") {
          return false;
        } else if (selectedRole === "relex" || selectedRole === "secretaire")
          return false;
        break;
    }

    return true;
  };

  const allowedOptions = (input) => {
    //for each user type we return roles or structures

    switch (input.id) {
      case "role":
        if (currentUser.role === "responsable") {
          return [
            { value: "employe", label: "Employe" },
            { value: "secretaire", label: "Secretaire" },
          ];
        } else if (currentUser.role === "directeur") {
          return [
            { value: "employe", label: "Employe" },
            { value: "secretaire", label: "Secretaire" },
            { value: "responsable", label: "responsable" },
            { value: "relex", label: "relex" },
          ];
        }
        break;
      case "structure":
        return input.options;
        break;

      default:
        break;
    }

    return input.options;
  };

  useEffect(() => {
    let timeout;

    if (successMsg) {
      timeout = setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [successMsg]);
  useEffect(() => {
    let timeout;

    if (predResult) {
      timeout = setTimeout(() => {
        setPredResult(null);
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [predResult]);

  useEffect(() => {
    let timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError("");
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [error]);

  return (
    <div className="formulaire">
      {type !== "ia-form" && <div className="listTitle">{title}</div>}
      <div className="inputs">
        {updatedEntries.map((entry, i) => {
          return (
            <div className="inputGroup" key={i}>
              {allowField(entry.id) && <label>{entry.label}</label>}

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
                      if (type === "mission" || type === "ia-form") {
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
              {entry.inputType === "select" && allowField(entry.id) && (
                <Select
                  ref={entry.id === "employes" ? selectInputRef : null}
                  className="select"
                  options={
                    type === "user" ? allowedOptions(entry) : entry.options
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
                  cols={7}
                  onChange={handleChange}
                  name={entry.id}
                />
              )}
              {errors[entry.id] && allowField(entry.id) && (
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
                onClick={
                  btn.title === "Prédire succés mission"
                    ? handlePredict
                    : handleSubmit
                }
                disabled={isLoading}
              >
                {btn.title}
              </button>
            );
        })}
      </div>
      {error && error !== "" && (
        <div className="error-message">
          <ErrorIcon className="icn" />
          {error}
        </div>
      )}
      {successMsg && successMsg !== "" && (
        <div className="success-message">
          <CheckCircleRoundedIcon className="icn" />
          {successMsg}
        </div>
      )}
      {/* {typeof predResult} */}
      {predResult && predResult >= 0 && (
        <div
          className={
            predResult > 0 ? "success-predict-message" : "error-predict-message"
          }
        >
          {predResult >= 2
            ? successMessages[predResult]
            : errorMessages[predResult]}
        </div>
      )}
    </div>
  );
};

export default Formulaire;
