import { useState } from "react";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import PieRechart from "../../../components/charts/PieRechart";
import {
  getCountFor,
  getGroupedDataForTime,
} from "../../../utils/ffiles_analytics";
import StackedBarRechart from "../../../components/charts/StackedBarRechart";
import useChartButtons from "../../../hooks/useChartButtons";
import AreaRechart from "../../../components/charts/AreaRechart";
import DashSettings from "../../../components/charts/widgets/DashSettings";
import FileSection from "../../../components/charts/widgets/FilesSection";

const FilesDashboard = () => {
  const filesKPISdata = useSelector((state) => state.stat.filesKPIS);
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  return (
    <div className="filesDashboard">
      <FloatingBar />
      <PageName name="files Dashboard" />
      <DashSettings handleButtonClick={handleButtonClick} />

      <FileSection
        data={filesKPISdata}
        fileName={"*"}
        title={"les statistiques sur tous les documents"}
        fileRadialOptions={["structure", "nature", "motifDep"]}
        chartsOptions={["structure", "etat"]}
        chartPer={chartPer}
        chartPerNum={chartPerNum}
      />
      <FileSection
        data={filesKPISdata}
        fileName={"RFM"}
        title={"les statistiques sur les rapports de fin de mission"}
        fileRadialOptions={["structure", "etat"]}
        chartsOptions={["structure", "etat"]}
        chartPer={chartPer}
        chartPerNum={chartPerNum}
      />
      <FileSection
        data={filesKPISdata}
        fileName={"DB"}
        title={"les statistiques sur les demandes de billetterie"}
        fileRadialOptions={["nature", "motifDep", "etat"]}
        chartsOptions={["nature", "motifDep", "etat"]}
        chartPer={chartPer}
        chartPerNum={chartPerNum}
      />
      <FileSection
        data={filesKPISdata}
        fileName={"DC"}
        title={"les statistiques sur les demandes de congés"}
        fileRadialOptions={["structure", "etat", "nature"]}
        chartsOptions={["structure", "etat", "nature"]}
        chartPer={chartPer}
        chartPerNum={chartPerNum}
      />
      <FileSection
        data={filesKPISdata}
        fileName={"OM"}
        title={"les statistiques sur les ordres de mission"}
        fileRadialOptions={["structure"]}
        chartsOptions={["structure"]}
        chartPer={chartPer}
        chartPerNum={chartPerNum}
      />
      <FileSection
        data={filesKPISdata}
        fileName={"DM"}
        title={"les statistiques sur les demandes de modifications"}
        fileRadialOptions={["structure", "etat"]}
        chartsOptions={["structure", "etat"]}
        chartPer={chartPer}
        chartPerNum={chartPerNum}
      />
    </div>
  );
};

export default FilesDashboard;
