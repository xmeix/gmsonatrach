import { useState } from "react";
import { useAuth } from "./useAuth";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  console.log(values);
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
      console.log("name:" + name + "|| value:" + value.value);
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

    // if (Array.isArray(value)) {
    //   const newValue = value.map((option) =>
    //     typeof option === "object" ? option.value : option
    //   );
    //   setValues((prevState) => ({
    //     ...prevState,
    //     [name]: newValue.value,
    //   }));
    // } else {
    //   setValues((prevState) => ({
    //     ...prevState,
    //     [name]: value,
    //   }));
    // }

    //console.log(values);
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return [values, handleChange, resetForm];
};

export default useForm;
