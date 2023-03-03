import { useState } from "react";

const useForm = (initialValues) => {
  const handleChange = (event) => {
    const [values, setValues] = useState(initialValues);

    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  return [values, handleChange, resetForm];
};

export default useForm;
