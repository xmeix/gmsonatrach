import { useSelector } from "react-redux";
import UploadDB from "../profilAdmin/UploadDB";
import "./../../css/Gestion.css";

const DbsImport = () => {
  const { user } = useSelector((state) => state.auth);

  return <div className="gestion">{user.role !== "relex" && <UploadDB />}</div>;
};

export default DbsImport;
