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
import useDateFilter from "../../hooks/useDateFilter";

const BarRechart = ({ xdataKey, data, dataKey, xlabel, ylabel, type }) => {
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
          <ResponsiveContainer width="80%" aspect={2}>
            <BarChart width={730} height={250} data={filteredData}>
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
        </>
      ) : (
        <div className="no-data">Pas de données disponible</div>
      )}
    </>
  );
};

export default BarRechart;
