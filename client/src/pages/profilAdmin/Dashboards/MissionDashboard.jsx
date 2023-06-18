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
import { Suspense, useState } from "react";
import PieRechart from "../../../components/charts/PieRechart";
import DashCard from "../../../components/charts/widgets/DashCard";
import RateTable from "../../../components/rateTable/RateTable";
import Formulaire from "../../../components/formulaire/Formulaire";
import {
  MissionAiEntries as entries,
  missionAiButtons as buttons,
} from "../../../data/formData";
const MissionDashboard = () => {
  let fmissionData = useSelector((state) => state.stat.missionKPIS);
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();
  const [btnlistItem, setbtnlistItem] = useState(7);

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
        <div className="g11">
          <div className="box a b1">
            {/* type - structure - etat - country*/}
            {customSelecta()}
            <div className="box-title">Nombre de missions par {xlabel}</div>
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

          <div className="box b b1">
            <Suspense fallback={<div>Loading...</div>}>
              {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
              <div className="box-title">
                Taux d'utilisation moyen des moyens de transport par {xlabel}
              </div>
              <ComposedRechart
                data={getMissionGroupedDataForTime(
                  fmissionData.filter((e) => e.etat === "terminée"),
                  chartPerNum,
                  "etat"
                )}
                labelType={chartPer}
                title={`Taux d'utilisation moyen des moyens de transport par ${xlabel}`}
                props={["airlineAvg", "roadAvg"]}
                labels={["Avion", "Route"]}
                label={[xlabel, "Taux(%)"]}
              />
            </Suspense>
          </div>
        </div>
        <div className="box s all">
          <div className="box-title">
            Evaluation productivité des employés a travers les tickets résolus
          </div>
          <RateTable type={3} />
        </div>
        <div className="g21">
          <div className="box d g2">
            <Suspense fallback={<div>Loading...</div>}>
              {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
              <div className="box-title">
                Taux de résolution des tickets par {xlabel}
              </div>
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
                label={[xlabel, "Taux(%)"]}
              />
            </Suspense>
          </div>
          <div className="box c g1">
            <Suspense fallback={<div>Loading...</div>}>
              {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
              {customSelectb()}
              <div className="box-title">
                Analyse d'utilisation des compagnies aérienne par {xlabel}
              </div>
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
        </div>
        <div className="box p all">
          <div className="box-title">
            Analyse de différents indicateurs des missions
          </div>
          <RateTable type={1} />
        </div>
        <div className="g11">
          <div className="gtt b1">
            <div className="box e">
              <Suspense fallback={<div>Loading...</div>}>
                {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
                {customSelectc()}
                <div className="box-title">
                  {option2c.label} par {xlabel}
                </div>
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
            <div className="box f">
              <Suspense fallback={<div>Loading...</div>}>
                <div className="box-title">
                  Taux d'accomplissement moyen des taches par {xlabel}
                </div>
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
                  label={[xlabel, "Taux(%)"]}
                />
              </Suspense>
            </div>
          </div>
          <div className="gtt box b1">
            {customSelectg()}
            <div className="box-title">
              Répartition des missions , missionnaires actuelles par{" "}
              {option1g.label}
            </div>
            <PieRechart
              data={getMissionCountFor(fmissionData, option1g.value)}
              type={"mission_count"}
              label="nombre de missions"
              labelType={"label"}
              title={`Répartition des missions actuelles par ${option1g.label}`}
              style={1}
            />

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
        </div>
        <div className="g11">
          <div className="gv">
            <div className="box">
              <Suspense fallback={<div>Loading...</div>}>
                {/* button to choose between 4 (year) and 7 (month) */}
                <div className="btn-list">
                  <button
                    style={{
                      backgroundColor:
                        btnlistItem === 4 ? "var(--orange1)" : "",
                    }}
                    onClick={() => setbtnlistItem(4)}
                  >
                    An actuel
                  </button>
                  <button
                    style={{
                      backgroundColor:
                        btnlistItem === 7 ? "var(--orange1)" : "",
                    }}
                    onClick={() => setbtnlistItem(7)}
                  >
                    Mois actuel
                  </button>
                </div>
                <DashCard
                  title={"taux de réalisation des mission"}
                  number={
                    missionCompletionRate(fmissionData, btnlistItem) + "%"
                  }
                />
              </Suspense>
            </div>{" "}
            <div className="box">
              <Suspense fallback={<div>Loading...</div>}>
                <DashCard
                  title={"la durée jugé nécessaire pour finaliser les missions"}
                  number={timeToCompletion(fmissionData) + " jours"}
                />
              </Suspense>
            </div>
          </div>
          <div className="box g gtt b1">
            <Suspense fallback={<div>Loading...</div>}>
              <div className="box-title">
                {option2d.label} par {xlabel}
              </div>
              {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
              {customSelectd()}
              <StackedBarRechart
                data={getMissionGroupedDataForTime(
                  fmissionData.filter((e) => e.etat === "terminée"),
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
        </div>
        <div className="box q all">
          <div className="box-title">
            Représentation de Taux De Productivité des employés
          </div>
          <RateTable type={2} />
        </div>
        <div className="g11">
          <div className="box i b1">
            <Suspense fallback={<div>Loading...</div>}>
              {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
              {customSelecte()}
              <div className="box-title">
                {option2e.label} par {xlabel}
              </div>
              <StackedBarRechart
                data={getMissionGroupedDataForTime(
                  fmissionData.filter((e) => e.etat === "terminée"),
                  chartPerNum,
                  option1e.value
                )}
                type={option2e.value}
                label={[xlabel, option2e.label]}
                labelType={chartPer}
                title={`${option2e.label} par ${xlabel}`}
              />
            </Suspense>
          </div>{" "}
          <div className="box r b1">
            {/* Formulaire check mission */}
            <div className="box-title">
              Prévision de pourcentage de succés des missions futurs
            </div>
            <Formulaire
              type="ia-form"
              entries={entries}
              buttons={buttons}
              title=""
            />
          </div>
        </div>
        <div className="g21">
          <div className="box h g2">
            <Suspense fallback={<div>Loading...</div>}>
              <div className="box-title">
                Analyse comparative du budget prévu et du budget réel par{" "}
                {xlabel}
              </div>
              {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
              <ComposedRechart
                data={getMissionGroupedDataForTime(
                  fmissionData.filter((e) => e.etat === "terminée"),
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
          <div className="box k g1">
            <Suspense fallback={<div>Loading...</div>}>
              {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
              {customSelectf()}
              <div className="box-title">
                Analyse des {option2f.label} des missions par {xlabel}
              </div>
              <StackedBarRechart
                data={getMissionGroupedDataForTime(
                  fmissionData.filter((e) => e.etat === "terminée"),
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
        </div>
        <div className="box j all">
          <Suspense fallback={<div>Loading...</div>}>
            {/* add this to fmissionData==> .filter((e) => e.etat === "terminée") */}
            <div className="box-title">
              Analyse comparative des durées estimé et passé des missions par
              {xlabel}
            </div>
            <ComposedRechart
              data={getMissionGroupedDataForTime(
                fmissionData.filter((e) => e.etat === "terminée"),
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
      </div>
    </div>
  );
};

export default MissionDashboard;
