import "./Loading.css";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="loading-screen">
      <CircularProgress className="progIcon" />
      <p className="loading-screen__text">Chargement...</p>
    </div>
  );
};

export default Loading;
