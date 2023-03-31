import { useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useDateFilter from "../../hooks/useDateFilter";

const ComposedRechart = ({ xdataKey, data, dataKey, xlabel, ylabel, type }) => {
  const { filteredData, isNoData, renderButtons } = useDateFilter(type, data);

  return (
    <>
      {renderButtons()}
      {!isNoData ? (
        <>
          {" "}
          <ResponsiveContainer width="80%" aspect={2}>
            <ComposedChart width={730} height={250} data={filteredData}>
              <XAxis dataKey={xdataKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey={dataKey} barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey={dataKey} stroke="#ff7300" />
            </ComposedChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div className="no-data">Pas de données disponible</div>
      )}
    </>
  );
};

export default ComposedRechart;
