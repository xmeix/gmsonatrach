import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const PieRechart = ({ xdataKey, data, dataKey }) => {
  const COLORS = [
    "#ff8500",
    "#ffa62f",
    "#ffba5d",
    "#ffd28c",
    "#ffe8ba",
    "#e27c00",
    "#c16300",
    "#a04b00",
    "#823300",
    "#5f1a00",
  ];

  return (
    <ResponsiveContainer width="80%" aspect={2}>
      <PieChart>
        <Pie data={data} dataKey={dataKey} nameKey={xdataKey} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
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
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieRechart;
