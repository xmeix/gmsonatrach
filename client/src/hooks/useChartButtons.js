import { useState } from "react";

const useChartButtons = (initialState) => {
  const [chartPer, setChartPer] = useState(initialState);

  const handleButtonClick = (chartType) => {
    setChartPer(chartType);
  };

  return { chartPer, handleButtonClick };
};
export default useChartButtons;
