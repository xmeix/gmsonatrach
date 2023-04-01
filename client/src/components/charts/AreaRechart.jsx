import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
const AreaRechart = ({ data, type, label, labelType, title }) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );

  return (
    <>
      {renderButtons()}
      <>
        <Line
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: title || "Custom Chart Title",
                padding: {
                  top: 10,
                },
                font: {
                  family: "Montserrat",
                  size: 15,
                  weight: 600,
                },
                position: "bottom",
              },
            },
          }}
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
