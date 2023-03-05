import "./Formulaire.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import useForm from "../../hooks/useForm";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
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
  const { register, error, isLoading, successMsg } = useAuth();
   const [values, handleChange, resetForm] = useForm(() => {
    const vals = {};
    entries.forEach((entry) => {
      vals[entry.id.toLowerCase()] = "";
    });
    delete vals[""]; // remove empty string key
    return vals;
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    switch (type) {
      case "user":
        {
          register(values);
        }
        break;
      case "mission":
        {
          register(values);
        }
        break;
      default:
        console.log("errrr");
    }
  };
  return (
    <div className="formulaire">
      <div className="inputs">
        {entries.map((entry, i) => {
          return (
            <div className="inputGroup" key={i}>
              <label htmlFor={entry.label}>{entry.label}</label>

              {entry.inputType !== "textArea" &&
                entry.inputType !== "select" &&
                entry.inputType !== "create-select" && (
                  <input
                    type={entry.inputType}
                    onChange={handleChange}
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
              {entry.inputType === "select" && (
                <Select
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
