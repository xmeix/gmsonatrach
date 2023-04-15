import { useEffect, useState } from "react";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues); 

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (Array.isArray(value)) {
      if (name === "taches") {
        const newValue = value.map((option) =>
          typeof option === "object"
            ? { content: option.value }
            : { content: option }
        );
        setValues((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
      } else {
        const newValue = value.map((option) =>
          typeof option === "object" ? option.value : option
        );
        setValues((prevState) => ({
          ...prevState,
          [name]: newValue,
        }));
      }
    } else if (typeof value === "object" && value !== null) {
      setValues((prevState) => ({
        ...prevState,
        [name]: value.value,
      }));
    } else if (name === "budget")
      setValues((prevState) => ({
        ...prevState,
        [name]: parseInt(value),
      }));
    else
      setValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
  };

  const resetForm = (initvalues) => {
    setValues(initvalues);
  };

  return [values, handleChange, resetForm];
};

export default useForm;
