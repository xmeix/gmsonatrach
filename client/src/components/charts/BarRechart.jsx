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

const BarRechart = ({
  xdataKey,
  data,
  dataKey,
  xlabel,
  ylabel,
  type,
  num,
  dataKey2,
}) => {
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
            <BarChart data={filteredData}>
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
              {num === 2 && <Bar dataKey={dataKey2} fill="#8854d9" />}
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
