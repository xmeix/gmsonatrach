import {
  getCountFor,
  getGroupedDataForTime,
} from "../../../utils/ffiles_analytics";
import PieRechart from "../PieRechart";
import StackedBarRechart from "../StackedBarRechart";
import "./FileSection.css";
import "./../../../pages/profilAdmin/Dashboards/MissionDashboard.css";
import AreaRechart from "../AreaRechart";
import useChartSettings from "../../../hooks/useChartSettings";
const FileSection = ({
  data,
  fileName,
  title,
  fileRadialOptions,
  chartsOptions,
  chartPer,
  chartPerNum,
}) => {
  const xlabel = chartPer === 1 ? "années" : chartPer === 2 ? "mois" : "jours";

  const pieType = (option) => {
    if (["structure"].includes(option)) {
      return 3;
    } else if (["motifDep", "nature"].includes(option)) {
      return 2;
    } else if (["etat"].includes(option)) {
      return 1;
    }
  };
  const xarray = chartsOptions.map((option, i) => {
    if (option === "motifDep") {
      return { label: "motif de déplacement", value: option };
    } else return { label: option, value: option };
  });

  const { option1: option1a, customSelect: customSelecta } =
    useChartSettings(xarray);
  const { option1: option1b, customSelect: customSelectb } =
    useChartSettings(xarray);
  const { option1: option1c, customSelect: customSelectc } =
    useChartSettings(xarray);

  return (
    <div className="fileSection">
      <div className="file-title">{title} circulants</div>
      <div className="dashboard-content">
        <div style={{ flexDirection: "row", flexWrap: "wrap" }} className="box">
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
        <div className="g11">
          <div className="box b1">
            {customSelecta()}
            <StackedBarRechart
              data={getGroupedDataForTime(
                data,
                chartPerNum,
                fileName,
                option1a.value
              )}
              type={"circulation_count"}
              label={[xlabel, "nombre de fichiers"]}
              labelType={chartPer}
              title={"Nombre de fichiers par année,mois et jour"}
            />
          </div>
          <div className="box b1">
            {customSelectb()}
            <AreaRechart
              data={getGroupedDataForTime(
                data,
                chartPerNum,
                fileName,
                option1b.value
              )}
              type={"circulation_count"}
              label={[xlabel, "nombre de fichiers"]}
              labelType={chartPer}
              title={"Nombre de fichiers par année,mois et jour"}
              fill={false}
            />
          </div>
        </div>
        <div className="box">
          {customSelectc()}
          <AreaRechart
            data={getGroupedDataForTime(
              data,
              chartPerNum,
              fileName,
              option1c.value
            )}
            type={"circulation_count"}
            label={[xlabel, "nombre de fichiers"]}
            labelType={chartPer}
            title={"Nombre de fichiers par année,mois et jour"}
            fill={true}
          />
        </div>
      </div>
    </div>
  );
};

export default FileSection;
