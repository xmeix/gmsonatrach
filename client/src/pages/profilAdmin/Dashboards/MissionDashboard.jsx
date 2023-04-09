import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import { lazy, Suspense, useEffect, useState } from "react";
import useChartButtons from "../../../hooks/useChartButtons";
const AreaRechart = lazy(() =>
  import("../../../components/charts/AreaRechart")
);
import DashSettings from "../../../components/charts/widgets/DashSettings";
const PieRechart = lazy(() => import("../../../components/charts/PieRechart"));
import "./MissionDash.css";
import ThinPieRechart from "../../../components/charts/ThinPieRechart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import ThumbUpOffAltRoundedIcon from "@mui/icons-material/ThumbUpOffAltRounded";
import ThumbDownAltRoundedIcon from "@mui/icons-material/ThumbDownAltRounded";
import AirplanemodeActiveRoundedIcon from "@mui/icons-material/AirplanemodeActiveRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import {
  currentCount,
  currentSuccessRate,
  getMissionCountFor,
  getMissionGroupedDataForTime,
} from "../../../utils/fmissions_analytics";
import StackedBarRechart from "../../../components/charts/StackedBarRechart";
import ComposedRechart from "../../../components/charts/ComposedRechart";
const MissionDashboard = () => {
  let fmissionData = useSelector((state) => state.stat.missionKPIS);

  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  return (
    <div className="missionDashboard">
      <FloatingBar />
      <PageName name="mission Dashboard" />
      <DashSettings handleButtonClick={handleButtonClick} />

      <div className="dash-content">
        <div style={{ gridArea: "a" }} className="box">
          {/* type - structure - etat - country*/}
          {
            <StackedBarRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                "etat"
              )}
              type={"mission_count"}
              label="nombre de missions"
              labelType={chartPer}
              title={"Nombre de missions par année,mois et jour"}
            />
          }
        </div>
        <div style={{ gridArea: "b" }} className="box">
          <PieRechart
            data={getMissionCountFor(fmissionData, "etat")}
            type={"mission_count"}
            label="nombre de missions"
            labelType={"label"}
            title={"Répartition des missions actuelles par structure/type/état"}
            style={1}
          />
        </div>
        <div style={{ gridArea: "c" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <PieRechart
              data={getMissionCountFor(fmissionData, "structure")}
              type={"employee_count"}
              label="nombre d'employés"
              labelType={"label"}
              title={
                "Répartition d'employés impliqués dans les missions par structure"
              }
              style={3}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "d" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* percentages OR numbers */}
            <StackedBarRechart
              data={getMissionGroupedDataForTime(
                fmissionData.filter((e) => e.etat === "terminée"), //.filter((e) => e.etat === "terminée") if structure
                chartPerNum,
                "structure"
              )}
              type={"successAvg"}
              label="Taux de réussite"
              labelType={chartPer}
              title={"Taux de réussite des missions par année,mois et jour"}
            />
          </Suspense>
        </div>
        <div
          style={{
            gridArea: "e",
            display: "flex",
            gap: "1em",
          }}
          className="box"
        >
          <span className="card-title">
            Taux de réussite global des missions actuel:
          </span>
          <span className="number">
            {currentSuccessRate(fmissionData, "success_count", "fail_count")} %
          </span>
          <CheckCircleIcon
            className="card-icon"
            style={{ color: "rgba(185, 233, 185, 0.411)" }}
          />
        </div>
        <div style={{ gridArea: "f" }} className="box">
          <span className="card-title">
            Nombre de taches accomplies global:
          </span>
          <span className="number">
            {currentCount(fmissionData, "success_count")} taches
          </span>
          <ThumbUpOffAltRoundedIcon
            className="card-icon"
            style={{ color: "rgba(211, 213, 252, 0.411)" }}
          />
        </div>
        <div style={{ gridArea: "g" }} className="box">
          <span className="card-title">
            Nombre de taches non accomplies global:
          </span>
          <span className="number">
            {currentCount(fmissionData, "fail_count")} taches
          </span>
          <ThumbDownAltRoundedIcon
            className="card-icon"
            style={{ color: "rgba(240, 177, 152, 0.411)" }}
          />
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData.filter((e) => e.etat === "terminée"),
                chartPerNum,
                "etat"
              )}
              labelType={chartPer}
              title={
                "Taux d'utilisation total des moyens de transport par année,mois et jour"
              }
              props={["airlineAvg", "roadAvg"]}
              labels={["Avion", "Route"]}
            />
         
          </Suspense>
        </div>
        <div style={{ gridArea: "i" }} className="box">
          card
        </div>
        <div style={{ gridArea: "j" }} className="box">
          <span className="card-title">
            Le taux d'utilisation total des routes pour les voyages d'affaires
          </span>
          <span className="number">
            {currentSuccessRate(
              fmissionData,
              "road_utilization_count",
              "airline_utilization_count"
            )}
            %
          </span>
          <DirectionsCarFilledRoundedIcon className="card-icon" />
        </div>
        <div style={{ gridArea: "k" }} className="box">
          <span className="card-title">
            La moyenne d'utilisation totale des compagnies aériennes pour les
            voyages d'affaires
          </span>
          <span className="number">
            {currentSuccessRate(
              fmissionData,
              "airline_utilization_count",
              "road_utilization_count"
            )}
            %
          </span>
          <AirplanemodeActiveRoundedIcon className="card-icon" />
        </div>
        <div style={{ gridArea: "l" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* normalement accomplies et non accomplies  */}
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData.filter((e) => e.etat === "terminée"),
                chartPerNum,
                "structure"
              )}
              labelType={chartPer}
              title={"Nombre de taches attribués par date"}
              props={["success_count", "fail_count"]}
              labels={["taches accomplies", "taches non accomplies"]}
            />
          </Suspense>
        </div>
      </div>

      {/* <div className="dash-content">
        <div style={{ gridArea: "a" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {chartType === "line" && (
              <LineRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
                title={"Nombre de missions par année,mois et jour"}
              />
            )}
            {chartType === "bar" && (
              <BarRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
                title={"Nombre de missions par année,mois et jour"}
              />
            )}
            {chartType === "area" && (
              <BarRechart
                data={getMissionsPer(fmissionData, chartPer)}
                type={"mission_count"}
                label="nombre de missions"
                labelType={chartPer}
                title={"Nombre de missions par année,mois et jour"}
              />
            )}
          </Suspense>
        </div>
        <div style={{ gridArea: "b" }} className="box">
          
          <Suspense fallback={<div>Loading...</div>}>
            <div className="subchart-buttons">
              <button onClick={() => setChart2Per(4)} className="subchart-btn">
                structure
              </button>
              <button onClick={() => setChart2Per(5)} className="subchart-btn">
                type
              </button>
              <button onClick={() => setChart2Per(6)} className="subchart-btn">
                etat
              </button>
            </div>

            <PieRechart
              data={getMissionsPer(fmissionData, chart2Per)}
              type={"mission_count"}
              label="nombre de missions"
              labelType={x2DataKey}
              title={"Répartition des missions par structure/type/état"}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "c" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <RadarRechart
              data={getEmployeesCountPerStructure(fmissionData)}
              type={"employee_count"}
              label="nombre de missions par structure"
              labelType={"structure"}
              title={"Répartition des employés par structure"}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "d" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <ComposedRechart
              data={groupSuccessRatesByDate(fmissionData, chartPer)}
              type={"success_rate"}
              label="Taux de réussite des missions"
              labelType={chartPer}
              title={
                "Taux de réussite total des missions par année,mois et jour"
              }
            />
          </Suspense>
        </div>
        <div
          style={{
            gridArea: "e",
            display: "flex",
            gap: "1em",
          }}
          className="box"
        >
          <span className="card-title">
            Taux de réussite global des missions:
          </span>
          <span className="number">{getTotalSuccessRate(fmissionData)} %</span>
          <CheckCircleIcon
            className="card-icon"
            style={{ color: "rgba(185, 233, 185, 0.411)" }}
          />
        </div>
        <div style={{ gridArea: "f" }} className="box">
          <span className="card-title">
            Nombre de taches accomplies global:
          </span>
          <span className="number">
            {getTotalTasksCount(fmissionData, 1)} taches
          </span>
          <ThumbUpOffAltRoundedIcon
            className="card-icon"
            style={{ color: "rgba(211, 213, 252, 0.411)" }}
          />
        </div>
        <div style={{ gridArea: "g" }} className="box">
          <span className="card-title">
            Nombre de taches non accomplies global:
          </span>
          <span className="number">
            {getTotalTasksCount(fmissionData, 2)} taches
          </span>
          <ThumbDownAltRoundedIcon
            className="card-icon"
            style={{ color: "rgba(240, 177, 152, 0.411)" }}
          />
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <BarRechart
              data={groupUtilRatesByDate(fmissionData, chartPer)}
              type={"road_utilization_rate"}
              label="Taux d'utilisation des moyens de transport 'route'"
              labelType={chartPer}
              type2={"airline_utilization_rate"}
              label2={"Taux d'utilisation des moyens de transport 'avion'"}
              num={2}
              title={
                "Taux d'utilisation total des moyens de transport par année,mois et jour"
              }
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "i" }} className="box">
          card
        </div>
        <div style={{ gridArea: "j" }} className="box">
          <span className="card-title">
            Le taux d'utilisation total des routes pour les voyages d'affaires
          </span>
          <span className="number">
            {getTotalUtilizationRate(fmissionData, 1)}
          </span>
          <DirectionsCarFilledRoundedIcon className="card-icon" />
        </div>
        <div style={{ gridArea: "k" }} className="box">
          <span className="card-title">
            La moyenne d'utilisation totale des compagnies aériennes pour les
            voyages d'affaires
          </span>
          <span className="number">
            {getTotalUtilizationRate(fmissionData, 2)}
          </span>
          <AirplanemodeActiveRoundedIcon className="card-icon" />
        </div>
        <div style={{ gridArea: "l" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <BarRechart
              data={getTasksCount(fmissionData, chartPer)}
              type={"accomplishedTask_count"}
              label="Nombre de taches accomplies"
              labelType={chartPer}
              type2={"nonAccomplishedTask_count"}
              label2={"Nombre de taches non accomplies"}
              num={2}
              title={"Nombre de taches attribués par date"}
            />
          </Suspense>
        </div>
      </div> */}
    </div>
  );
};

export default MissionDashboard;
