import User from "../models/User.js";
import mongoose from "mongoose";
import OrdreMission from "../models/OrdreMission.js";
const toId = mongoose.Types.ObjectId;

export const getAllOrdresMissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const ordresMission = await OrdreMission.find()
      .populate("employe")
      .populate("mission");
    let filteredOMissions;
    if (user.role === "relex") throw new Error("Unauthorized");
    else if (user.role === "directeur" || user.role === "secretaire")
      filteredOMissions = ordresMission;
    else if (user.role === "responsable") {
      filteredOMissions = await Promise.all(
        ordresMission.map(async (om) => {
          let emp = await User.findById(om.employe);
          console.log(emp.structure);
          console.log(user.structure);
          return emp.structure === user.structure ? om : null;
        })
      );

      // Filter out null values from the resulting array
      filteredOMissions = filteredOMissions.filter((om) => om !== null);
    } else if (user.role === "employe") {
      //if error occured then change to user.id without toId
      filteredOMissions = ordresMission.filter(
        (om) => om.employe.toString() === toId(user.id).toString()
      );
    }
    res.status(200).json({ filteredOMissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
