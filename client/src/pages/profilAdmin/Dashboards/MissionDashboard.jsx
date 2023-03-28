import LineRechart from "../../../components/charts/LineRechart";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";

const MissionDashboard = () => {
  return (
    <div className="missionDashboard">
      <FloatingBar />
      <PageName name="mission Dashboard" />
      <div className="dash-content">
        <LineRechart />
      </div>
    </div>
  );
};

export default MissionDashboard;
