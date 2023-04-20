import Settings from "../../../components/charts/widgets/Settings";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import useChartButtons from "../../../hooks/useChartButtons";

const UsersDashboard = () => {
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  return (
    <div className="usersDashboard">
      <Settings handleButtonClick={handleButtonClick} />

      <PageName name="Users Dashboard" />
    </div>
  );
};

export default UsersDashboard;
