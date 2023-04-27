import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const StackedBarRechart = ({
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
  const datasets = filteredData.reduce((acc, curr) => {
    const index = acc.findIndex((d) => d.label === curr.stack);
    if (index !== -1) {
      acc[index].data.push(curr[type]);
    } else {
      const newData = {
        label: curr.stack,
        data: createdAtLabels.map((l) => {
          const recentData = filteredData.find(
            (d) => d.stack === curr.stack && d.createdAt === l
          );
          return recentData ? recentData[type] : null;
        }),
        barThickness: 50,
        borderWidth: 2,
      };
      acc.push(newData);
    }
    return acc;
  }, []);

  // console.log("datasets", datasets);
  return (
    <>
      {renderButtons()}
      <>
        <Bar
          options={{
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
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

export default StackedBarRechart;
