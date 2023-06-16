import { useSelector } from "react-redux";
import useChartButtons from "../../../hooks/useChartButtons";
import "./MissionDashboard.css";
import Settings from "../../../components/charts/widgets/Settings";
import useChartSettings from "../../../hooks/useChartSettings";
import { getMissionGroupedDataForTime } from "../../../utils/fmissions_analytics";
import StackedBarRechart from "../../../components/charts/StackedBarRechart";
import ComposedRechart from "../../../components/charts/ComposedRechart";
import { Suspense } from "react";

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
        {/* ___________________________GROUPE3__________________________ */}
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
            {customSelectc()}
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
        {/* ___________________________GROUPE3__________________________ */}
      </div>
    </div>
  );
};

export default MissionDashboard;
