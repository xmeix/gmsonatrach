import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";

const LineRechart = ({ xdataKey, data, height, width, dataKey }) => {
  return (
    <LineChart
      width={800}
      height={400}
      data={data}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis
        dataKey={xdataKey}
        label={{ value: "xLabel", position: "insideBottomRight" }}
      />
      <YAxis
        name="nombre missions"
        label={{ value: "yLabel", position: "insideTopLeft" }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke="#ff8500"
        name="nombre de missions"
      />
      <Tooltip />
    </LineChart>
  );
};

export default LineRechart;
