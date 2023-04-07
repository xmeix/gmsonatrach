import { useState } from "react";

const useChartButtons = () => {
  const [chartPer, setChartPer] = useState(1);
  const [chartPerNum, setChartPerNum] = useState(4);

  const handleButtonClick = (chartType) => {
    switch (chartType) {
      case 1:
        setChartPer(chartType);
        setChartPerNum(4);
        break;
      case 2:
        setChartPer(chartType);
        setChartPerNum(7);
        break;
      case 3:
        setChartPer(chartType);
        setChartPerNum(10);
        break;

      default:
        break;
    }
  };

  return { chartPer, chartPerNum, handleButtonClick };
};
export default useChartButtons;
