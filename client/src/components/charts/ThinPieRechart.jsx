import { Pie, PieChart, ResponsiveContainer } from "recharts";

const ThinPieRechart = ({ xdataKey, data, dataKey }) => {
  return (
    <ResponsiveContainer width="100%" aspect={2}>
      <PieChart>
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={xdataKey}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#82ca9d"
          label
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ThinPieRechart;
