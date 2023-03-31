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
    "#6BB7EC", // a medium blue
    "#FFD966", // a light yellow
    "#B2DFDB", // a pale blue-green
    "#F8BBD0", // a light pink
    "#9FA8DA", // a muted blue
    "#FFCC80", // a muted orange
    "#C5E1A5", // a muted green
    "#80CBC4", // a muted blue-green
    "#F48FB1", // a medium pink
    "#FFCCBC", // a pale peach
    "#B2EBF2", // a light cyan
    "#FFAB91", // a light salmon
    "#DCEDC8", // a pale green
    "#E6EE9C", // a pale lime
  ];

  return (
    <ResponsiveContainer width="100%" aspect={2}>
      <PieChart  >
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
