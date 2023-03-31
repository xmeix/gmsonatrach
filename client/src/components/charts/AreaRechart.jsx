import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
const AreaRechart = ({ data, type, label, labelType }) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );

  return (
    <>
      {renderButtons()}
      <>
        <Line
          options={{ responsive: true, noDataMessage: "No data to display" }}
          data={{
            labels: filteredData.map((d) => d.day),
            datasets: [
              {
                fill: true,
                label: label,
                data: filteredData.map((d) => d[type]),
              },
            ],
          }}
        />
      </>
    </>
  );
};

export default AreaRechart;
