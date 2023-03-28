import LineRechart from "../../../components/charts/LineRechart";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import { getMissionsPer } from "../../../utils/fmissions_analytics";
const MissionDashboard = () => {
  const fmissionData = useSelector((state) => state.auth.missionKPIS);
  return (
    <div className="missionDashboard">
      <FloatingBar />
      <PageName name="mission Dashboard" />
      <div className="dash-content">
        <LineRechart
          xdataKey={"year"}
          data={getMissionsPer(fmissionData, "month")}
          dataKey={"mission_count"}
        />
      </div>
    </div>
  );
};

export default MissionDashboard;
