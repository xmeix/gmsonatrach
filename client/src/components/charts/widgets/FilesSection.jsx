import { Component, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  getCountFor,
  getGroupedDataForTime,
} from "../../../utils/ffiles_analytics";
import PieRechart from "../PieRechart";
import StackedBarRechart from "../StackedBarRechart";
import "./FileSection.css";
import AreaRechart from "../AreaRechart";
import DashCard from "./dashCard";
const FileSection = ({
  data,
  fileName,
  title,
  fileRadialOptions,
  chartsOptions,
  chartPer,
  chartPerNum,
}) => {
  const [chartAction, setChartAction] = useState("structure");

  const pieType = (option) => {
    if (["structure"].includes(option)) {
      return 3;
    } else if (["motifDep", "nature"].includes(option)) {
      return 2;
    } else if (["etat"].includes(option)) {
      return 1;
    }
  };

  return (
    <div className="fileSection">
      <div className="file-title">{title} circulants</div>
      <div className="file-section-content">
        <div style={{ gridArea: "a", flexDirection: "row" }} className="box">
          {chartsOptions.map((option, i) => (
            <button
              key={i}
              className="subchart-btn "
              onClick={() => setChartAction(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div style={{ gridArea: "b" }} className="box">
          <StackedBarRechart
            data={getGroupedDataForTime(
              data,
              chartPerNum,
              fileName,
              chartAction
            )}
            type={"circulation_count"}
            label="nombre de fichiers"
            labelType={chartPer}
            title={"Nombre de missions par année,mois et jour"}
          />
        </div>
        <div style={{ gridArea: "c" }} className="box">
          <AreaRechart
            data={getGroupedDataForTime(
              data,
              chartPerNum,
              fileName,
              chartAction
            )}
            type={"circulation_count"}
            label="nombre de missions"
            labelType={chartPer}
            title={"Nombre de missions par année,mois et jour"}
            fill={false}
          />
        </div>
        <div
          style={{ gridArea: "d", flexDirection: "row", flexWrap: "wrap" }}
          className="box"
        >
          {fileRadialOptions.map((option, i) => (
            <PieRechart
              key={i}
              data={getCountFor(data, option, fileName)}
              type={"circulation_count"}
              label="nombre de fichiers"
              labelType={"label"}
              title={
                "Répartition des documents par structure/type/état (current data) "
              }
              style={pieType(option)}
            />
          ))}
        </div>
        <div style={{ gridArea: "e" }} className="box">
          {/* <DashCard title={"helll"} number={10} /> */}
        </div>
        <div style={{ gridArea: "f" }} className="box">
          {" "}
          <AreaRechart
            data={getGroupedDataForTime(
              data,
              chartPerNum,
              fileName,
              chartAction
            )}
            type={"circulation_count"}
            label="nombre de missions"
            labelType={chartPer}
            title={"Nombre de missions par année,mois et jour"}
            fill={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FileSection;
