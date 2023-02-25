import "./Row.css";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Button from "../button/Button";
const Row = () => {
  return (
    <div className="row">
      <div className="info">
        <p className="id">
          <span>id:</span> 188875
        </p>
        <p className="etat">en cours</p>
      </div>
      <div className="buttons">
        <Button title="accepter" />
        <Button title="annuler" />
      </div>
    </div>
  );
};

export default Row;
