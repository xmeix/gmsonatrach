import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const ComposedRechart = ({
  data,
  type,
  label,
  labelType,
  type2,
  label2,
  num,
}) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );
  return (
    <>
      {renderButtons()}
      <>
        <Chart
          options={{ responsive: true, noDataMessage: "No data to display" }}
          data={{
            labels: filteredData.map((d) => d.day),
            datasets: [
              {
                type: "bar",
                label: label,
                data: filteredData.map((d) => d[type]),
              },
              {
                type: "line",
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

export default ComposedRechart;
