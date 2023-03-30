import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import useDateFilter from "../../hooks/useDateFilter";
const LineRechart = ({ xdataKey, data, dataKey, xlabel, ylabel, type }) => {
  const { 
    filteredData, 
    isNoData,
    renderButtons,
  } = useDateFilter(type, data);
  return (
    <>
      {" "}
      {renderButtons()}
      {!isNoData ? (
        <>
          <ResponsiveContainer width="80%" aspect={2}>
            <LineChart
              data={filteredData}
              margin={{ top: 20, right: 10, bottom: 20, left: 10 }}
            >
              <Legend verticalAlign="top" height={30} align="center" />
              <CartesianGrid
                stroke="#ccc"
                horizontal="true"
                vertical=""
                opacity={0.5}
              />
              <XAxis
                padding={{ left: 30, right: 30 }}
                dataKey={xdataKey}
                label={{
                  value: xlabel,
                  position: "insideBottom",
                  offset: -10,
                }}
                tick={{
                  fill: "var(--gray)",
                  fontSize: "12",
                  fontWeight: "500",
                }}
              />
              <YAxis
                label={{
                  value: ylabel,
                  angle: -90,
                  position: "insideLeft",
                  offset: 15,
                }}
                tick={{
                  fill: "var(--gray)",
                  fontSize: "12",
                  fontWeight: "500",
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="var(--light-orange)"
                strokeWidth={3}
                name="nombre de missions"
                dot={{
                  fill: "var(--white)",
                  stroke: "var(--orange)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{ r: 6 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--white)",
                  color: "var(--gray)",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "solid 1px var(--light-gray)",
                }}
                itemStyle={{
                  fontSize: "15px",
                }}
                cursor={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="no-data">Pas de données disponible</div>
      )}
    </>
  );
};

export default LineRechart;
