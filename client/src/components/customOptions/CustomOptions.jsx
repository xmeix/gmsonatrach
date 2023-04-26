import { useState } from "react";
import Select from "react-select";

const CustomOptions = ({ options1, options2, options3 }) => {
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
 
   return (
    <div className="custom-options">
      {op1 && (
        <Select
          className="select"
          options={["a", "b"]}
          placeholder="{entry.placeholder}"
          styles={customStyles}
          onChange={handleOption1}
        />
      )}
      {op2 && (
        <Select
          className="select"
          value={option2}
          options={["a", "b"]}
          placeholder="{entry.placeholder}"
          styles={customStyles}
          onChange={handleOption2}
        />
      )}
      {op3 && (
        <Select
          className="select"
          value={option1}
          options={["a", "b"]}
          placeholder="{entry.placeholder}"
          styles={customStyles}
          onChange={handleOption3}
        />
      )}
    </div>
  );
};

export default CustomOptions;
