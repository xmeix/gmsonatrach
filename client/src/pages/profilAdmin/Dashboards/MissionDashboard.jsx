import { useSelector } from "react-redux";
import useChartButtons from "../../../hooks/useChartButtons";
import "./MissionDashboard.css";
import Settings from "../../../components/charts/widgets/Settings";
import useChartSettings from "../../../hooks/useChartSettings";
import {
  getMissionCountFor,
  getMissionGroupedDataForTime,
  missionCompletionRate,
  timeToCompletion,
} from "../../../utils/fmissions_analytics";
import StackedBarRechart from "../../../components/charts/StackedBarRechart";
import ComposedRechart from "../../../components/charts/ComposedRechart";
import AreaRechart from "../../../components/charts/AreaRechart";
import { Suspense } from "react";
import PieRechart from "../../../components/charts/PieRechart";
import DashCard from "../../../components/charts/widgets/DashCard";
import RateTable from "../../../components/rateTable/RateTable";

const MissionDashboard = () => {
  let fmissionData = useSelector((state) => state.stat.missionKPIS);
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  const {
    option1: option1a,
    option2: option2a,
    customSelect: customSelecta,
  } = useChartSettings(
    [
      { label: "type", value: "type" },
      { label: "structure", value: "structure" },
      { label: "etat", value: "etat" },
      { label: "pays", value: "country" },
      { label: "départ", value: "departure" },
      { label: "destination", value: "destination" },
    ],
    [
      { label: "nombre de missions", value: "mission_count" },
      { label: "nombre d'employés", value: "employee_count" },
    ]
  );
  const {
    option1: option1b,
    option2: option2b,
    customSelect: customSelectb,
  } = useChartSettings(
    [
      { label: "type", value: "type" },
      { label: "structure", value: "structure" },
      { label: "pays", value: "country" },
      { label: "départ", value: "departure" },
      { label: "destination", value: "destination" },
    ],
    [
      { label: "Taux moyen d'utilisation CAérienne ", value: "airlineAvg" },
      { label: "Taux moyen d'utilisation CRoute", value: "roadAvg" },
      {
        label: "Nombre d'utilisation CAérienne",
        value: "airline_utilization_count",
      },
      { label: "Nombre d'utilisation CRoute", value: "road_utilization_count" },
    ]
  );

  const {
    option1: option1c,
    option2: option2c,
    customSelect: customSelectc,
  } = useChartSettings(
    [
      { label: "type", value: "type" },
      { label: "etat", value: "etat" },
      { label: "structure", value: "structure" },
      { label: "pays", value: "country" },
      { label: "départ", value: "departure" },
      { label: "destination", value: "destination" },
    ],
    [
      { label: "Taux moyen des tickets cloturés ", value: "ticketSuccessAvg" },
      { label: "Taux moyen des tickets ouverts ", value: "ticketFailAvg" },
      { label: "Nombre de tickets cloturés ", value: "solved_ticket_count" },
      { label: "Nombre de tickets ouverts ", value: "unsolved_ticket_count" },
    ]
  );
  const {
    option1: option1d,
    option2: option2d,
    customSelect: customSelectd,
  } = useChartSettings(
    [
      { label: "type", value: "type" },
      { label: "etat", value: "etat" },
      { label: "structure", value: "structure" },
      { label: "pays", value: "country" },
      { label: "départ", value: "departure" },
      { label: "destination", value: "destination" },
    ],
    [
      { label: "Taux moyen des taches accomplies ", value: "taskSuccessAvg" },
      {
        label: "Taux moyen  des taches non-accomplies ",
        value: "taskFailAvg",
      },
      { label: "Nombre de taches accomplies ", value: "done_tasks_count" },
      {
        label: "Nombre de taches non-accomplies ",
        value: "undone_tasks_count",
      },
    ]
  );
  const {
    option1: option1e,
    option2: option2e,
    customSelect: customSelecte,
  } = useChartSettings(
    [
      { label: "type", value: "type" },
      { label: "structure", value: "structure" },
      { label: "pays", value: "country" },
      { label: "départ", value: "departure" },
      { label: "destination", value: "destination" },
    ],
    [
      { label: "Budget estimé ", value: "estimated_budget" },
      {
        label: "Budget consommé",
        value: "consumed_budget",
      },
    ]
  );
  const {
    option1: option1f,
    option2: option2f,
    customSelect: customSelectf,
  } = useChartSettings(
    [
      { label: "type", value: "type" },
      { label: "structure", value: "structure" },
      { label: "pays", value: "country" },
      { label: "départ", value: "departure" },
      { label: "destination", value: "destination" },
    ],
    [
      { label: "Durée estimée ", value: "time_Estimated" },
      {
        label: "Durée passée",
        value: "time_Spent",
      },
    ]
  );
  const { option1: option1g, customSelect: customSelectg } = useChartSettings([
    { label: "type", value: "type" },
    { label: "structure", value: "structure" },
    { label: "etat", value: "etat" },
  ]);

  const xlabel = chartPer === 1 ? "années" : chartPer === 2 ? "mois" : "jours";

  return (
    <div className="missionDashboard">
      <Settings handleButtonClick={handleButtonClick} />
      <div className="dashboard-content">
        {/* just need to test : 'missions en cours + terminées' */}
        <div style={{ gridArea: "a" }} className="box">
          {/* type - structure - etat - country*/}
          {customSelecta()}
          <StackedBarRechart
            data={getMissionGroupedDataForTime(
              fmissionData,
              chartPerNum,
              option1a.value
            )}
            type={option2a.value}
            label={[xlabel, option2a.label]}
            labelType={chartPer}
            title={`Nombre de missions par ${xlabel}`}
          />
        </div>
        {/* ___________________________GROUPE1__________________________ */}
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                "etat"
              )}
              labelType={chartPer}
              title={`Taux d'utilisation moyen des moyens de transport par ${xlabel}`}
              props={["airlineAvg", "roadAvg"]}
              labels={["Avion", "Route"]}
              label={[xlabel, "Taux d'utilisation moyen"]}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            {customSelectb()}
            <StackedBarRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                option1b.value
              )}
              type={option2b.value}
              label={[xlabel, option2b.label]}
              labelType={chartPer}
              title={`${option2b.label} par ${xlabel}`}
            />
          </Suspense>
        </div>
        {/* ___________________________GROUPE1__________________________ */}{" "}
        {/* ___________________________GROUPE2__________________________ */}
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                "etat"
              )}
              labelType={chartPer}
              title={`Taux de résolution des tickets par ${xlabel}`}
              props={["ticketSuccessAvg", "ticketFailAvg"]}
              labels={["tickets cloturés", "tickets ouverts"]}
              label={[xlabel, "Taux de résolution moyen des tickets"]}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            {customSelectc()}
            <StackedBarRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                option1c.value
              )}
              type={option2c.value}
              label={[xlabel, option2c.label]}
              labelType={chartPer}
              title={`${option2c.label} par ${xlabel}`}
            />
          </Suspense>
        </div>
        {/* ___________________________GROUPE2__________________________ */}
        {/* ___________________________GROUPE3__________________________ */}
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                "etat"
              )}
              labelType={chartPer}
              title={`Taux d'accomplissement moyen des taches par ${xlabel}`}
              props={["taskSuccessAvg", "taskFailAvg"]}
              labels={["Taches accomplies", "taches non accomplies"]}
              label={[xlabel, "Taux d'accomplissement moyen des taches"]}
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            {customSelectd()}
            <StackedBarRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                option1d.value
              )}
              type={option2d.value}
              label={[xlabel, option2d.label]}
              labelType={chartPer}
              title={`${option2d.label} par ${xlabel}`}
            />
          </Suspense>
        </div>
        {/* ___________________________GROUPE3__________________________ */}{" "}
        {/* ___________________________GROUPE4__________________________ */}
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                "etat"
              )}
              labelType={chartPer}
              title={`Analyse comparative du budget prévu et du budget réel par ${xlabel}`}
              props={["estimated_budget", "consumed_budget"]}
              labels={["Budget Estimé", "Budget Consommé"]}
              label={[xlabel, "Budget(DZD)"]}
              tc1="line"
              tc2="line"
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            {customSelecte()}
            <StackedBarRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                option1e.value
              )}
              type={option2e.value}
              label={[xlabel, option2e.label]}
              labelType={chartPer}
              title={`${option2e.label} par ${xlabel}`}
            />
          </Suspense>
        </div>
        {/* ___________________________GROUPE4__________________________ */}
        {/* ___________________________GROUPE5__________________________ */}
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                "etat"
              )}
              labelType={chartPer}
              title={`Analyse comparative des durées estimé et passé des missions par ${xlabel}`}
              props={["time_Estimated", "time_Spent"]}
              labels={["Durée Estimée(jours)", "Durée passée(jours)"]}
              label={[xlabel, "Durée(jours)"]}
              tc1="line"
              tc2="line"
            />
          </Suspense>
        </div>
        <div style={{ gridArea: "h" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            {customSelectf()}
            <StackedBarRechart
              data={getMissionGroupedDataForTime(
                fmissionData,
                chartPerNum,
                option1f.value
              )}
              type={option2f.value}
              label={[xlabel, option2f.label + "(jours)"]}
              labelType={chartPer}
              title={`${option2f.label} par ${xlabel}`}
            />
          </Suspense>
        </div>
        {/* ___________________________GROUPE5__________________________ */}
        {/* ________________________________PIES_____________________________ */}
        <div style={{ gridArea: "b" }} className="box">
          {customSelectg()}
          <PieRechart
            data={getMissionCountFor(fmissionData, option1g.value)}
            type={"mission_count"}
            label="nombre de missions"
            labelType={"label"}
            title={`Répartition des missions actuelles par ${option1g.label}`}
            style={1}
          />
        </div>
        <div style={{ gridArea: "c" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            <PieRechart
              data={getMissionCountFor(
                fmissionData.filter((e) => e.etat === "en-cours"),
                "structure"
              )}
              type={"employee_count"}
              label="nombre de missionnaires"
              labelType={"label"}
              title={`Répartition des missionnaires par structure`}
              style={3}
            />
          </Suspense>
        </div>
        {/* ________________________________PIES_____________________________ */}
        {/* ________________________________CARDS_____________________________ */}
        <div style={{ gridArea: "c" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* button to choose between 4 (year) and 7 (month) */}
            <DashCard
              title={"taux de réalisation de la mission"}
              number={missionCompletionRate(fmissionData, 7) + "%"}
            />
          </Suspense>
        </div>{" "}
        <div style={{ gridArea: "c" }} className="box">
          <Suspense fallback={<div>Loading...</div>}>
            {/* button to choose between 4 (year) and 7 (month) */}
            <DashCard
              title={"le délai jugé nécessaire pour finaliser les missions"}
              number={timeToCompletion(fmissionData) + " jours"}
            />
          </Suspense>
        </div>
        {/* ________________________________CARDS_____________________________ */}
        {/* ________________________________TABLE_____________________________ */}
        <div style={{ gridArea: "c" }} className="box">
          <RateTable type={1} />
        </div>{" "}
        <div style={{ gridArea: "c" }} className="box">
          <RateTable type={2} />
        </div>
        {/* ________________________________TABLE_____________________________ */}
      </div>
    </div>
  );
};

export default MissionDashboard;
