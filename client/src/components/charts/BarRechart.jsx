import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const BarRechart = ({
  data,
  type,
  label,
  labelType,
  type2,
  label2,
  num,
  title,
}) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );
  let datasets = [
    {
      label: label,
      data: filteredData.map((d) => d[type]),
      stack: "Stack 0",
    },
  ];

  if (num === 2) {
    datasets.push({
      label: label2,
      data: filteredData.map((d) => d[type2]),
      stack: "Stack 1",
    });
  }
  return (
    <>
      {renderButtons()}
      <>
        <Bar
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: title || "Custom Chart Title",
                padding: {
                  top: 10,
                  bottom: 10,
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
            labels: filteredData.map((d) => d.createdAt),
            datasets: datasets,
          }}
        />
      </>
    </>
  );
};

export default BarRechart;
