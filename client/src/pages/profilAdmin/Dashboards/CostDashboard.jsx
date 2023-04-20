import Settings from "../../../components/charts/widgets/Settings";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import useChartButtons from "../../../hooks/useChartButtons";

const CostDashboard = () => {
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  return (
    <div className="costDashboard">
      <Settings handleButtonClick={handleButtonClick} />

      <PageName name="Cost Dashboard" />
    </div>
  );
};

export default CostDashboard;
