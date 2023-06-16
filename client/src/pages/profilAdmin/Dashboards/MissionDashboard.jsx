import { useSelector } from "react-redux";
import useChartButtons from "../../../hooks/useChartButtons";
import "./MissionDashboard.css";
import Settings from "../../../components/charts/widgets/Settings";
import useChartSettings from "../../../hooks/useChartSettings";
import { getMissionGroupedDataForTime } from "../../../utils/fmissions_analytics";
import StackedBarRechart from "../../../components/charts/StackedBarRechart";

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

  const xlabel = chartPer === 1 ? "années" : chartPer === 2 ? "mois" : "jours";

  return (
    <div className="missionDashboard">
      <Settings handleButtonClick={handleButtonClick} />
      <div className="dashboard-content">
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
            title={"Nombre de missions par année,mois et jour"}
          />
        </div>{" "}
      </div>
    </div>
  );
};

export default MissionDashboard;
