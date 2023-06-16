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
  label,
  tc1,
  tc2,
}) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );

  const createdAtLabels = [...new Set(filteredData.map((d) => d.createdAt))];

  const successData = createdAtLabels.map((date) => {
    const mostRecentSuccess = filteredData
      .filter((d) => d.createdAt === date && d[props[0]])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    return mostRecentSuccess ? mostRecentSuccess[props[0]] : 0;
  });

  const failData = createdAtLabels.map((date) => {
    const mostRecentFail = filteredData
      .filter((d) => d.createdAt === date && d[props[1]])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    return mostRecentFail ? mostRecentFail[props[1]] : 0;
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
                title: {
                  display: true,
                  text: label[0],
                  font: {
                    family: "Montserrat",
                    weight: "bold",
                  },
                },
              },
              y: {
                stacked: false,
                title: {
                  display: true,
                  text: label[1],
                  font: {
                    family: "Montserrat",
                    weight: "bold",
                  },
                },
              },
            },
          }}
          data={{
            labels: createdAtLabels,
            datasets: [
              {
                type: tc1 ? tc1 : "bar",
                label: labels[0],
                data: successData,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                maxBarThickness: 50,
                minBarThickness: 20,
              },
              {
                type: tc2 ? tc2 : "bar",
                label: labels[1],
                data: failData,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
                maxBarThickness: 50,
                minBarThickness: 20,
              },
            ],
          }}
        />
      </>
    </>
  );
};

export default ComposedRechart;
