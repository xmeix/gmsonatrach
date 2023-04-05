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
  stackType,
}) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );

  let DS = [...new Set(filteredData.map((d) => d["stack"]))]
    .flatMap((stackType) => {
      return filteredData
        .filter((d) => d["stack"] === stackType)
        .reduce((acc, cur) => {
          const yearIndex = acc.findIndex(
            (el) =>
              el["stack"] === cur["stack"] &&
              el["createdAt"] === cur["createdAt"]
          );
          if (yearIndex === -1) {
            acc.push({
              createdAt: cur.createdAt,
              stack: cur["stack"],
              circulation_count: cur.circulation_count,
            });
          } else {
            acc[yearIndex].circulation_count += cur.circulation_count;
          }
          return acc;
        }, []);
    })
    .map((d) => d);

  let datasets = [...new Set(DS.map((d) => d[stackType]))].map((etat, i) => {
    return {
      label: etat,
      data: DS.filter((d) => d[stackType] === etat).map((d) => d[type]),
      stack: `Stack ${etat}`,
    };
  });
  console.log("DS");
  console.log(DS);
  console.log("DS");

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
            labels: [...new Set(DS.map((d) => d.createdAt))].sort(),
            datasets: datasets,
          }}
        />
      </>
    </>
  );
};

export default StackedBarRechart;
