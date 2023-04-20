import { useState } from "react";

export const filesConfig = [
  {
    fileName: "tous",
    title: "les statistiques sur tous les documents",
    fileRadialOptions: ["structure", "nature", "motifDep"],
    chartsOptions: ["structure", "etat"],
    name: "tous",
  },
  {
    fileName: "RFM",
    title: "les statistiques sur les rapports de fin de mission",
    fileRadialOptions: ["structure", "etat"],
    chartsOptions: ["structure", "etat"],
    name: "rapports de fin de mission",
  },
  {
    fileName: "DB",
    title: "les statistiques sur les demandes de billetterie",
    fileRadialOptions: ["nature", "motifDep", "etat"],
    chartsOptions: ["nature", "motifDep", "etat"],
    name: "demandes de billetterie",
  },
  {
    fileName: "DC",
    title: "les statistiques sur les demandes de congés",
    fileRadialOptions: ["structure", "etat", "nature"],
    chartsOptions: ["structure", "etat", "nature"],
    name: "demandes de congés",
  },
  {
    fileName: "OM",
    title: "les statistiques sur les ordres de mission",
    fileRadialOptions: ["structure"],
    chartsOptions: ["structure"],
    name: "ordres de mission",
  },
  {
    fileName: "DM",
    title: "les statistiques sur les demandes de modifications",
    fileRadialOptions: ["structure", "etat"],
    chartsOptions: ["structure", "etat"],
    name: "demandes de modifications",
  },
];
const useFile = () => {
  const [file, setFile] = useState(filesConfig[0]);

  const handleFileChange = (e) => {
    const selectedFileName = e.target.value;
    const selectedFile = filesConfig.find(
      (file) => file.fileName === selectedFileName
    );
    setFile(selectedFile);
  };

  return { file, handleFileChange };
};
export default useFile;
