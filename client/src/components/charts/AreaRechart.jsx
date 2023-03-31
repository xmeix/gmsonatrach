import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useDateFilter from "../../hooks/useDateFilter";
const AreaRechart = ({ xdataKey, data, dataKey, xlabel, ylabel, type }) => {
  const {
    filteredData,

    isNoData,
    renderButtons,
  } = useDateFilter(type, data);
  return (
    <>
      {renderButtons()}
      {!isNoData ? (
        <>
          <ResponsiveContainer width="100%" aspect={2}>
            <AreaChart
              width="100%"
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Legend verticalAlign="top" height={30} align="center" />

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
              <CartesianGrid
                stroke="#ccc"
                horizontal="true"
                vertical=""
                opacity={0.5}
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
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="no-data">Pas de données disponible</div>
      )}
    </>
  );
};

export default AreaRechart;
