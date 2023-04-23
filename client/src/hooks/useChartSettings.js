import { useState } from "react";

const useChartSettings = ({ op1, op2, op3 }) => {
  const [option1, setOption1] = useState(op1);
  const [option2, setOption2] = useState(op2);
  const [option3, setOption3] = useState(op3);

  const handleOption1 = (option) => {
    setOption1(option);
  };
  const handleOption2 = (option) => {
    setOption2(option);
  };
  const handleOption3 = (option) => {
    setOption3(option);
  };

  return { chartPer, chartPerNum, handleOption1, handleOption2, handleOption3 };
};
export default useChartSettings;
