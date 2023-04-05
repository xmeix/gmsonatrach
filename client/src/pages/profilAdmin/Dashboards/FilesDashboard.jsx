import { useState } from "react";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import PieRechart from "../../../components/charts/PieRechart";
import { getCountFor } from "../../../utils/ffiles_analytics";
import BarRechart from "../../../components/charts/BarRechart";

const FilesDashboard = () => {
  const filesKPISdata = useSelector((state) => state.stat.filesKPIS);

  return (
    <div className="filesDashboard">
      <FloatingBar />

      <PageName name="files Dashboard" />

      <PieRechart
        data={getCountFor(filesKPISdata, "motifDep", "DB")}
        type={"circulation_count"}
        label="nombre de fichiers"
        labelType={"label"}
        title={"Répartition des documents par structure/type/état"}
      />

      <BarRechart
        data={getCountFor(filesKPISdata, 4, "OM")}
        type={"circulation_count"}
        label="nombre de fichiers"
        labelType={1}
        title={"Nombre de missions par année,mois et jour"}
      />
    </div>
  );
};

export default FilesDashboard;
