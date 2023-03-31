import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import {
  getEmployeesCountPerStructure,
  getMissionsPer,
  getTasksCount,
  getTotalSuccessRate,
  getTotalUtilizationRate,
  groupSuccessRatesByDate,
  groupUtilRatesByDate,
} from "../../../utils/fmissions_analytics";
import { lazy, Suspense, useEffect, useState } from "react";
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
import ThinPieRechart from "../../../components/charts/ThinPieRechart";

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
        <div style={{ gridArea: "a" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {chartType === "line" && (
              <LineRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
              />
            )}
            {chartType === "bar" && (
              <BarRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
              />
            )}
            {chartType === "area" && (
              <BarRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
              />
            )}
          </Suspense>
        </div>
        <div style={{ gridArea: "b" }} className="box">
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

            <PieRechart
              data={getMissionsPer(fmissionData, chart2Per)}
              type={"mission_count"}
              label="nombre de missions"
              labelType={x2DataKey}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "c" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <RadarRechart
              data={getEmployeesCountPerStructure(fmissionData)}
              type={"employee_count"}
              label="nombre de missions"
              labelType={"structure"}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "d" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <ComposedRechart
              data={groupSuccessRatesByDate(fmissionData, chartPer)}
              type={"success_rate"}
              label="nombre de missions"
              labelType={chartPer}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "e" }} className="box">
          card
        </div>
        <div style={{ gridArea: "f" }} className="box">
          card
        </div>
        <div style={{ gridArea: "g" }} className="box">
          card
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <BarRechart
              data={groupUtilRatesByDate(fmissionData, chartPer)}
              type={"road_utilization_rate"}
              label="road_utilization_rate"
              labelType={chartPer}
              type2={"airline_utilization_rate"}
              label2={"airline_utilization_rate"}
              num={2}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "i" }} className="box">
          card
        </div>
        <div style={{ gridArea: "j" }} className="box">
          card
        </div>
        <div style={{ gridArea: "k" }} className="box">
          card
        </div>
        <div style={{ gridArea: "l" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <BarRechart
              data={getTasksCount(fmissionData, chartPer)}
              type={"accomplishedTask_count"}
              label="accomplishedTask_count"
              labelType={chartPer}
              type2={"nonAccomplishedTask_count"}
              label2={"nonAccomplishedTask_count"}
              num={2}
            />
          </Suspense>
        </div>
      </div>
      {/* <div className="dash-content">
        <div className="box" style={{ gridArea: "a" }}>
          <Suspense fallback={<div>Loading...</div>}>
            {chartType === "line" && (
              <LineRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
              />
            )}
            {chartType === "bar" && (
              <BarRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
              />
            )}
            {chartType === "area" && (
              <BarRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
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
              data={getMissionsPer(fmissionData, chart2Per)}
              type={"mission_count"}
              label="nombre de missions"
              labelType={x2DataKey}
            />
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "c" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <ComposedRechart
              data={groupSuccessRatesByDate(fmissionData, chartPer)}
              type={"success_rate"}
              label="nombre de missions"
              labelType={chartPer}
            />
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "d" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <RadarRechart
              data={getEmployeesCountPerStructure(fmissionData)}
              type={"employee_count"}
              label="nombre de missions"
              labelType={"structure"}
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
              data={getTasksCount(fmissionData, chartPer)}
              type={"accomplishedTask_count"}
              label="accomplishedTask_count"
              labelType={chartPer}
              type2={"nonAccomplishedTask_count"}
              label2={"nonAccomplishedTask_count"}
              num={2}
            />
          </Suspense>
        </div>
        <div className="box" style={{ gridArea: "g" }}>
          card
        </div>
        <div className="box" style={{ gridArea: "h" }}>
          {"Le taux d'utilisation total des routes pour les voyages d'affaires." +
            getTotalUtilizationRate(fmissionData, 1)}
          {"La moyenne d'utilisation totale des compagnies aériennes pour les voyages d'affaires." +
            getTotalUtilizationRate(fmissionData, 2)}
        </div>
        <div className="box" style={{ gridArea: "i" }}>
          <Suspense fallback={<div>Loading...</div>}>
            <BarRechart
              data={groupUtilRatesByDate(fmissionData, chartPer)}
              type={"road_utilization_rate"}
              label="road_utilization_rate"
              labelType={chartPer}
              type2={"airline_utilization_rate"}
              label2={"airline_utilization_rate"}
              num={2}
            />
          </Suspense>
        </div>
      </div> */}
    </div>
  );
};

export default MissionDashboard;
