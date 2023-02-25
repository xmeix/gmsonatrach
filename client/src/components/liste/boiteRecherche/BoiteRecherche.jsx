import "./BoiteRecherche.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputAdornment } from "@mui/material";
const BoiteRecherche = ({ search }) => {
  return (
    <div className="boiteRecherche">
      <InputAdornment
        position="start"
        style={{ position: "absolute", top: "0.9em", left: "0.2em" }}
      >
        <SearchRoundedIcon className="searchIcon" />
      </InputAdornment>
      <input
        type="search"
        placeholder={`type your ${search} here`}
        className="searchInput"
      />
    </div>
  );
};

export default BoiteRecherche;
