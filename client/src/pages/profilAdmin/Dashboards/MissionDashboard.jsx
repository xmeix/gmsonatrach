import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import LineRechart from "../../../components/charts/LineRechart";
import { getMissionsPer } from "../../../utils/fmissions_analytics";
import { useEffect, useState } from "react";
import BarRechart from "../../../components/charts/BarRechart";
import AreaRechart from "../../../components/charts/AreaRechart";
import "./Charts.css";
import PieRechart from "../../../components/charts/PieRechart";

const MissionDashboard = () => {
  const fmissionData = useSelector((state) => state.stat.missionKPIS);
  const [chartPer, setChartPer] = useState(1);
  const [chart2Per, setChart2Per] = useState(4);
  const [xDataKey, setXDataKey] = useState("year");
  const [x2DataKey, setX2DataKey] = useState("structure");
  const [chartType, setChartType] = useState("bar");
  const [chart2Type, setChart2Type] = useState("pie");
  useEffect(() => {
    if (chartPer === 1) {
      setXDataKey("year");
      setChartType("bar");
    } else if (chartPer === 2) {
      setXDataKey("month");
      setChartType("line");
    } else if (chartPer === 3) {
      setXDataKey("day");
      setChartType("area");
    }
    if (chart2Per === 4) {
      setX2DataKey("structure");
      setChart2Type("pie");
    } else if (chart2Per === 5) {
      setX2DataKey("type");
      setChart2Type("pie");
    } else if (chart2Per === 6) {
      setX2DataKey("state");
      setChart2Type("pie");
    }
  }, [chartPer, chart2Per]);

  return (
    <div className="missionDashboard">
      <FloatingBar />
      <PageName name="mission Dashboard" />
      <div className="dash-content">
        <div className="chart-container">
          <div className="chart-buttons">
            <button onClick={() => setChartPer(1)} className="chart-btn">
              année
            </button>
            <button onClick={() => setChartPer(2)} className="chart-btn">
              mois
            </button>
            <button onClick={() => setChartPer(3)} className="chart-btn">
              jour
            </button>
          </div>
          <div className="chart">
            {chartType === "line" && (
              <LineRechart
                xdataKey={xDataKey}
                data={getMissionsPer(fmissionData, chartPer)}
                dataKey={"mission_count"}
                xlabel="années"
                ylabel="nombre de missions"
              />
            )}
            {chartType === "bar" && (
              <BarRechart
                xdataKey={xDataKey}
                data={getMissionsPer(fmissionData, chartPer)}
                dataKey={"mission_count"}
              />
            )}
            {chartType === "area" && (
              <AreaRechart
                xdataKey={xDataKey}
                data={getMissionsPer(fmissionData, chartPer)}
                dataKey={"mission_count"}
              />
            )}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-buttons">
            <button onClick={() => setChart2Per(4)} className="chart-btn">
              structure
            </button>
            <button onClick={() => setChart2Per(5)} className="chart-btn">
              type
            </button>
            <button onClick={() => setChart2Per(6)} className="chart-btn">
              etat
            </button>
          </div>
          <div className="chart-container">
            <PieRechart
              xdataKey={x2DataKey}
              data={getMissionsPer(fmissionData, chart2Per)}
              dataKey={"mission_count"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionDashboard;
