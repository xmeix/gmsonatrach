import "./BoiteRecherche.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
const BoiteRecherche = ({ search }) => {
  return (
    <div className="boiteRecherche">
      <SearchRoundedIcon className="searchIcon" />
      <input
        type="search"
        placeholder={`type your ${search} here`}
        className="searchInput"
      />
    </div>
  );
};

export default BoiteRecherche;
