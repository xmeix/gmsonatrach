import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const ComposedRechart = ({
  data, 
  labelType, 
  title,
  props,
  labels,
}) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );

  const createdAtLabels = [...new Set(filteredData.map((d) => d.createdAt))];
  console.log(filteredData);
  const successData = createdAtLabels.map((date) => {
    const successCount = filteredData
      .filter((d) => d.createdAt === date && d[props[0]])
      .reduce((sum, d) => sum + d[props[0]], 0);
    return successCount;
  });

  const failData = createdAtLabels.map((date) => {
    const failCount = filteredData
      .filter((d) => d.createdAt === date && d[props[1]])
      .reduce((sum, d) => sum + d[props[1]], 0);
    return failCount;
  });

  return (
    <>
      {renderButtons()}
      <>
        <Chart
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
            scales: {
              x: {
                stacked: false,
              },
              y: {
                stacked: false,
              },
            },
          }}
          data={{
            labels: createdAtLabels,
            datasets: [
              {
                type: "bar",
                label: labels[0],
                data: successData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
              },
              {
                type: "bar",
                label: labels[1],
                data: failData,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
            ],
          }}
        />
      </>
    </>
  );
};

export default ComposedRechart;
