import "./Loading.css";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="loading-screen">
      <CircularProgress className="progIcon" />
      <p className="loading-screen__text">Loading...</p>
    </div>
  );
};

export default Loading;
