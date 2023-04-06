import { useState } from "react";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import PieRechart from "../../../components/charts/PieRechart";
import {
  getCountFor,
  getGroupedDataForTime,
} from "../../../utils/ffiles_analytics";
import BarRechart from "../../../components/charts/BarRechart";
import StackedBarRechart from "../../../components/charts/StackedBarRechart";
import LineRechart from "../../../components/charts/LineRechart";
import useChartButtons from "../../../hooks/useChartButtons";

const FilesDashboard = () => {
  const filesKPISdata = useSelector((state) => state.stat.filesKPIS);
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  return (
    <div className="filesDashboard">
      <FloatingBar />

      <PageName name="files Dashboard" />
      <div className="dash-settings">
        <div className="dash-title">
          Basculer entre les vues quotidiennes, mensuelles et annuelles et
          adapter votre tableau de bord à vos besoins spécifiques.
        </div>
        <div className="chart-buttons">
          <button onClick={() => handleButtonClick(1)} className="chart-btn">
            année
          </button>
          <button onClick={() => handleButtonClick(2)} className="chart-btn">
            mois
          </button>
          <button onClick={() => handleButtonClick(3)} className="chart-btn">
            jour
          </button>
        </div>
      </div>
      <PieRechart
        data={getCountFor(filesKPISdata, "etat", "DM")}
        type={"circulation_count"}
        label="nombre de fichiers"
        labelType={"label"}
        title={
          "Répartition des documents par structure/type/état (current data) "
        }
        style={3}
      />

      <StackedBarRechart
        data={getGroupedDataForTime(filesKPISdata, chartPerNum, "DM", "etat")}
        type={"circulation_count"}
        label="nombre de fichiers"
        labelType={chartPer}
        title={"Nombre de missions par année,mois et jour"}
      />

      <LineRechart
        data={getGroupedDataForTime(filesKPISdata, chartPerNum, "DM", "etat")}
        type={"circulation_count"}
        label="nombre de missions"
        labelType={chartPer}
        title={"Nombre de missions par année,mois et jour"}
      />
    </div>
  );
};

export default FilesDashboard;
