import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import {
  getMissionsPer,
  groupSuccessRatesByDate,
} from "../../../utils/fmissions_analytics";
import { lazy, Suspense, useEffect, useState } from "react";
import "./Charts.css";
import ComposedRechart from "../../../components/charts/ComposedRechart";
const LineRechart = lazy(() =>
  import("../../../components/charts/LineRechart")
);
const BarRechart = lazy(() => import("../../../components/charts/BarRechart"));
const AreaRechart = lazy(() =>
  import("../../../components/charts/AreaRechart")
);
const PieRechart = lazy(() => import("../../../components/charts/PieRechart"));

const MissionDashboard = () => {
  const fmissionData = useSelector((state) => state.stat.missionKPIS);
  const [chartPer, setChartPer] = useState(1);
  const [chart2Per, setChart2Per] = useState(4);
  const [chart3Per, setChart3Per] = useState(1);
  const [x2DataKey, setX2DataKey] = useState("structure");
  const [chartType, setChartType] = useState("bar");
  const [chart2Type, setChart2Type] = useState("pie");
  useEffect(() => {
    if (chartPer === 1) {
      setChartType("bar");
    } else if (chartPer === 2) {
      setChartType("line");
    } else if (chartPer === 3) {
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
          {" "}
          <Suspense fallback={<div>Loading...</div>}>
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
                  xdataKey={"day"}
                  data={getMissionsPer(fmissionData, chartPer)}
                  dataKey={"mission_count"}
                  xlabel="années"
                  ylabel="nombre de missions"
                  type={chartPer}
                />
              )}
              {chartType === "bar" && (
                <BarRechart
                  xdataKey={"day"}
                  data={getMissionsPer(fmissionData, chartPer)}
                  dataKey={"mission_count"}
                  type={chartPer}
                />
              )}
              {chartType === "area" && (
                <AreaRechart
                  xdataKey={"day"}
                  data={getMissionsPer(fmissionData, chartPer)}
                  dataKey={"mission_count"}
                  type={chartPer}
                />
              )}
            </div>
          </Suspense>
        </div>

        <div className="chart-container">
          {" "}
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        </div>
        <div className="chart-container">
          {" "}
          <Suspense fallback={<div>Loading...</div>}>
            <div className="chart-buttons">
              <button onClick={() => setChart3Per(1)} className="chart-btn">
                année
              </button>
              <button onClick={() => setChart3Per(2)} className="chart-btn">
                mois
              </button>
              <button onClick={() => setChart3Per(3)} className="chart-btn">
                jour
              </button>
            </div>
            <div className="chart-container">
              <ComposedRechart
                xdataKey={"day"}
                data={groupSuccessRatesByDate(fmissionData, chart3Per)}
                dataKey={"success_rate"}
                xlabel="jours"
                ylabel="taux de succés"
                type={chart3Per}
              />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MissionDashboard;
