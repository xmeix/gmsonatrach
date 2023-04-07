import { useState } from "react";
import FloatingBar from "../../../components/floatingbar/FloatingBar";
import PageName from "../../../components/pageName/PageName";
import { useSelector } from "react-redux";
import useChartButtons from "../../../hooks/useChartButtons";
import DashSettings from "../../../components/charts/widgets/DashSettings";
import FileSection from "../../../components/charts/widgets/FilesSection";
import { HashLink } from "react-router-hash-link";
import "./Dashboard.css";

const filesConfig = [
  {
    fileName: "*",
    title: "les statistiques sur tous les documents",
    fileRadialOptions: ["structure", "nature", "motifDep"],
    chartsOptions: ["structure", "etat"],
  },
  {
    fileName: "RFM",
    title: "les statistiques sur les rapports de fin de mission",
    fileRadialOptions: ["structure", "etat"],
    chartsOptions: ["structure", "etat"],
  },
  {
    fileName: "DB",
    title: "les statistiques sur les demandes de billetterie",
    fileRadialOptions: ["nature", "motifDep", "etat"],
    chartsOptions: ["nature", "motifDep", "etat"],
  },
  {
    fileName: "DC",
    title: "les statistiques sur les demandes de congés",
    fileRadialOptions: ["structure", "etat", "nature"],
    chartsOptions: ["structure", "etat", "nature"],
  },
  {
    fileName: "OM",
    title: "les statistiques sur les ordres de mission",
    fileRadialOptions: ["structure"],
    chartsOptions: ["structure"],
  },
  {
    fileName: "DM",
    title: "les statistiques sur les demandes de modifications",
    fileRadialOptions: ["structure", "etat"],
    chartsOptions: ["structure", "etat"],
  },
];

const FilesDashboard = () => {
  const filesKPISdata = useSelector((state) => state.stat.filesKPIS);
  const { chartPer, chartPerNum, handleButtonClick } = useChartButtons();

  return (
    <div className="filesDashboard">
      <FloatingBar />
      <PageName name="files Dashboard" />
      <DashSettings handleButtonClick={handleButtonClick} />
      <div className="files-control-nav">
        {filesConfig.map((config, index) => (
          <HashLink
            key={index}
            smooth
            to={`#${config.fileName}`}
            className={`hashlink hashlink${config.fileName}`}
          >
            {config.fileName !== "*" ? config.fileName : "tous"}
          </HashLink>
        ))}
      </div>
      {filesConfig.map((config, index) => (
        <div key={index} id={config.fileName}>
          <FileSection
            key={index}
            data={filesKPISdata}
            fileName={config.fileName}
            title={config.title}
            fileRadialOptions={config.fileRadialOptions}
            chartsOptions={config.chartsOptions}
            chartPer={chartPer}
            chartPerNum={chartPerNum}
          />{" "}
        </div>
      ))}
    </div>
  );
};

export default FilesDashboard;
