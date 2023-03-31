import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const RadarRechart = ({ xdataKey, data, dataKey, xlabel, ylabel, type }) => {
  return (
    <>
      {" "}
      <ResponsiveContainer width="100%" aspect={2}>
        <RadarChart outerRadius={90} width="100%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey={dataKey} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} />
          <Radar
            name="nombre employés"
            dataKey={xdataKey}
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.6}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </>
  );
};

export default RadarRechart;
