import "./BoiteRecherche.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputAdornment } from "@mui/material";
const BoiteRecherche = ({ search }) => {
  return (
    <div className="boiteRecherche">
      <InputAdornment
        position="start"
        style={{ position: "absolute", top: "1.1em", left: "0.5em" }}
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
