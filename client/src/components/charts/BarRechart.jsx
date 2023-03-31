import useDateFilter from "../../hooks/useDateFilter";
import Nodata from "./Nodata";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const BarRechart = ({ data, type, label, labelType, type2, label2, num }) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(
    labelType,
    data
  );
  return (
    <>
      {renderButtons()}
      <>
        <Bar
        options={{ responsive: true, noDataMessage: "No data to display" }}
          data={{
            labels: filteredData.map((d) => d.day),
            datasets: [
              {
                label: label,
                data: filteredData.map((d) => d[type]),
                stack: "Stack 0",
              },
              num === 2 && {
                label: label2,
                data: filteredData.map((d) => d[type2]),
                stack: "Stack 1",
              },
            ],
          }}
        />
      </>
    </>
  );
};

export default BarRechart;
