import { useState } from "react";
import { useAuth } from "./useAuth";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevState) => {
      const newState = { ...prevState };
      if (typeof value === "object" && value !== null) {
        newState[name] = value.value; // get the value property of the object
      } else {
        newState[name] = value;
      }
      return newState;
    });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return [values, handleChange, resetForm];
};

export default useForm;
