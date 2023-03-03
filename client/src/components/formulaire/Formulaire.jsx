import "./Formulaire.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import {
  userEntries as entries,
  userButtons as buttons,
  userEntries,
} from "../../data/formData";
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

const Formulaire = () => {
  const [values, handleChange, resetForm] = useForm(() => {
    const vals = {};
    userEntries.forEach((entry) => {
      vals[entry.label] = "";
    });
    return vals;
  });

  return (
    <form className="formulaire">
      <div className="inputs">
        {entries.map((entry, i) => {
          return (
            <div className="inputGroup" key={i}>
              <label htmlFor={entry.label}>{entry.label}</label>

              {entry.inputType !== "textArea" &&
                entry.inputType !== "select" && (
                  <input type={entry.inputType} />
                )}
              {entry.inputType === "create-select" && (
                <CreatableSelect
                  className="select"
                  isMulti={entry.isMulti}
                  placeholder={entry.label}
                  options={entry.options}
                  styles={customStyles}
                />
              )}
              {entry.inputType === "select" && (
                <Select
                  className="select"
                  options={entry.options}
                  isMulti={entry.isMulti}
                  placeholder={entry.label}
                  styles={customStyles}
                />
              )}
              {entry.inputType === "textArea" && <textarea rows={5} cols={7} />}
            </div>
          );
        })}
      </div>
      <div className="buttons">
        {buttons.map((btn, index) => {
          return (
            <button
              type={btn.type}
              className="formBtn"
              key={index}
              onClick={btn.onClick}
            >
              {btn.title}
            </button>
          );
        })}
      </div>
    </form>
  );
};

export default Formulaire;
