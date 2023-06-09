import { useSelector } from "react-redux";
import UploadM from "../profilAdmin/UploadM";
import "./../../css/Gestion.css";

const MissionImport = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="gestion">
      {user.role !== "employe" && user.role !== "relex" && <UploadM />}
    </div>
  );
};

export default MissionImport;
