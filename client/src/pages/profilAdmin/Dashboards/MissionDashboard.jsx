import { useSelector } from "react-redux";
import useChartButtons from "../../../hooks/useChartButtons";
import "./MissionDashboard.css";


const MissionDashboard = () => {
  let fmissionData = useSelector((state) => state.stat.missionKPIS);
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  return <div className="missionDashboard">mission dashboard</div>;
};

export default MissionDashboard;
