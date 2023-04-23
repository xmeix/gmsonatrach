import { useState } from "react";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import { useSelector } from "react-redux";
import useChartButtons from "../../../hooks/useChartButtons";
import { HashLink } from "react-router-hash-link";
import "./Dashboard.css";
import { lazy, Suspense } from "react";
const FileSection = lazy(() =>
  import("./../../../components/charts/widgets/FilesSection")
);
import DashSettings from "../../../components/charts/widgets/DashSettings";
import Loading from "./../../../components/loading/Loading";
import useFile from "../../../hooks/useFile";
import Settings from "../../../components/charts/widgets/Settings";

const FilesDashboard = () => {
  let filesKPISdata = useSelector((state) => state.stat.filesKPIS);
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();
  const { file, handleFileChange } = useFile();

  return (
    <div className="filesDashboard missionDashboard">
      <Settings
        handleButtonClick={handleButtonClick}
        handleFileChange={handleFileChange}
        file={file}
      />
      <div id={file.fileName}> 
        <Suspense fallback={<Loading />}>
          <FileSection
            data={filesKPISdata}
            fileName={file.fileName}
            title={file.title}
            fileRadialOptions={file.fileRadialOptions}
            chartsOptions={file.chartsOptions}
            chartPer={chartPer}
            chartPerNum={chartPerNum}
          />{" "}
        </Suspense>
      </div>
    </div>
  );
};

export default FilesDashboard;
