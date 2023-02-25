import "./BoiteRecherche.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
const BoiteRecherche = () => {
  return (
    <div className="boiteRecherche">
      <SearchRoundedIcon className="searchIcon" />
      <input placeholder="look for" className="searchInput" />
    </div>
  );
};

export default BoiteRecherche;
