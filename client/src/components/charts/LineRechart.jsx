import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const LineRechart = ({
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
  const createdAtLabels = [...new Set(filteredData.map((d) => d.createdAt))];
  console.log(filteredData);
  const datasets = filteredData.reduce((acc, curr) => {
    const index = acc.findIndex((d) => d.label === curr.stack);
    if (index !== -1) {
      acc[index].data.push(curr[type]);
    } else {
      const newData = {
        label: curr.stack,
        data: createdAtLabels.map((l) =>
          filteredData
            .filter((d) => d.stack === curr.stack && d.createdAt === l)
            .reduce((sum, d) => sum + d[type], 0)
        ),
      };
      acc.push(newData);
    }
    return acc;
  }, []);
  console.log(datasets);

  return (
    <>
      {renderButtons()}
      <>
        <Line
          options={{
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: false,
              },
            },
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
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
          }}
          data={{
            labels: createdAtLabels,
            datasets: datasets,
          }}
        />
      </>
    </>
  );
};

export default LineRechart;
