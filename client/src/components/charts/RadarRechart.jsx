import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

const RadarRechart = ({ xdataKey, data, dataKey, xlabel, ylabel, type }) => {
  return (
    <>
      <RadarChart outerRadius={90} width={730} height={250} data={data}>
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
    </>
  );
};

export default RadarRechart;
