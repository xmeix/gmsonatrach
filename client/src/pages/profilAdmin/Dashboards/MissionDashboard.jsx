import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import {
  getEmployeesCountPerStructure,
  getMissionsPer,
  getTasksCount,
  getTotalSuccessRate,
  groupSuccessRatesByDate,
  groupUtilRatesByDate,
} from "../../../utils/fmissions_analytics";
import { lazy, Suspense, useEffect, useState } from "react";
import "./Charts.css";
import ComposedRechart from "../../../components/charts/ComposedRechart";
import RadarRechart from "../../../components/charts/RadarRechart";
import useChartButtons from "../../../hooks/useChartButtons";
const LineRechart = lazy(() =>
  import("../../../components/charts/LineRechart")
);
const BarRechart = lazy(() => import("../../../components/charts/BarRechart"));
const AreaRechart = lazy(() =>
  import("../../../components/charts/AreaRechart")
);
const PieRechart = lazy(() => import("../../../components/charts/PieRechart"));
import "./MissionDash.css";
const MissionDashboard = () => {
  const fmissionData = useSelector((state) => state.stat.missionKPIS);
  const [chart2Per, setChart2Per] = useState(4);
  const { chartPer, handleButtonClick } = useChartButtons(1);

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
      <div className="dash-settings">
        <div className="dash-title">choose your overview</div>
        <div className="chart-buttons">
          <button onClick={() => handleButtonClick(1)} className="chart-btn">
            année
          </button>
          <button onClick={() => handleButtonClick(2)} className="chart-btn">
            mois
          </button>
          <button onClick={() => handleButtonClick(3)} className="chart-btn">
            jour
          </button>
        </div>
      </div>

      <div className="dash-content">
        <div className="box" style={{ gridArea: "a" }}>
          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "b" }}>
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

            <PieRechart
              xdataKey={x2DataKey}
              data={getMissionsPer(fmissionData, chart2Per)}
              dataKey={"mission_count"}
            />
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "c" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <ComposedRechart
              xdataKey={"day"}
              data={groupSuccessRatesByDate(fmissionData, chartPer)}
              dataKey={"success_rate"}
              xlabel="jours"
              ylabel="taux de succés"
              type={chartPer}
            />
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "d" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <RadarRechart
              xdataKey={"employee_count"}
              data={getEmployeesCountPerStructure(fmissionData)}
              dataKey={"structure"}
              xlabel="jours"
              ylabel="taux de succés"
              type={chartPer}
            />
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "e" }}>
          <span className="card-title">
            Taux de réussite global des missions:
          </span>
          <span className="number">{getTotalSuccessRate(fmissionData)} %</span>
        </div>
        <div className="box" style={{ gridArea: "f" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <BarRechart
              xdataKey={"day"}
              data={getTasksCount(fmissionData, chartPer)}
              dataKey={"accomplishedTask_count"}
              type={chartPer}
              num={2}
              dataKey2={"nonAccomplishedTask_count"}
            />
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "g" }}>
          card
        </div>
        <div className="box" style={{ gridArea: "h" }}>
          2 pie charts
        </div>
        <div className="box" style={{ gridArea: "i" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <BarRechart
              xdataKey={"day"}
              data={groupUtilRatesByDate(fmissionData, chartPer)}
              dataKey={"road_utilization_rate"}
              type={chartPer}
              num={2}
              dataKey2={"airline_utilization_rate"}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default MissionDashboard;
