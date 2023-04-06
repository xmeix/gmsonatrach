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

const FilesDashboard = () => {
  const filesKPISdata = useSelector((state) => state.stat.filesKPIS);

  return (
    <div className="filesDashboard">
      <FloatingBar />

      <PageName name="files Dashboard" />

      <PieRechart
        data={getCountFor(filesKPISdata, "etat", "DM")}
        type={"circulation_count"}
        label="nombre de fichiers"
        labelType={"label"}
        title={
          "Répartition des documents par structure/type/état (current data) "
        }
      />

      <StackedBarRechart
        data={getGroupedDataForTime(filesKPISdata, 4, "DM", "etat")}
        type={"circulation_count"}
        label="nombre de fichiers"
        labelType={1}
        title={"Nombre de missions par année,mois et jour"}
      />

      <LineRechart
        data={getGroupedDataForTime(filesKPISdata, 4, "DM", "etat")}
        type={"circulation_count"}
        label="nombre de missions"
        labelType={1}
        title={"Nombre de missions par année,mois et jour"}
      />
    </div>
  );
};

export default FilesDashboard;
