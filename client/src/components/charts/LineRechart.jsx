import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
const dataPerDay = [
  { date: "2022-01-01", visitors: 100 },
  { date: "2022-01-02", visitors: 120 },
  { date: "2022-01-03", visitors: 150 },
  // and so on
];

const dataPerMonth = [
  { date: "2022-01", visitors: 3000 },
  { date: "2022-02", visitors: 3500 },
  { date: "2022-03", visitors: 4000 },
  // and so on
];

const dataPerYear = [
  { date: "2022", visitors: 50000 },
  { date: "2023", visitors: 60000 },
  // and so on
];
const LineRechart = () => {
  const data = [...dataPerDay, ...dataPerMonth, ...dataPerYear];

  return (
    <LineChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Legend />
      <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
    </LineChart>
  );
};

export default LineRechart;
