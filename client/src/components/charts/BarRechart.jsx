import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarRechart = ({ xdataKey, data, dataKey, xlabel, ylabel }) => {
  return (
    <ResponsiveContainer width="80%" aspect={2}>
      <BarChart width={730} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xdataKey} />
        <YAxis />
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
        <Bar dataKey={dataKey} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarRechart;
