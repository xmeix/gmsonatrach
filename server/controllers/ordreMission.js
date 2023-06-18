import User from "../models/User.js";
import mongoose from "mongoose";
import OrdreMission from "../models/OrdreMission.js";
import { createOrUpdateFDocument } from "./FilesKpis.js";
const toId = mongoose.Types.ObjectId;

export const getAllOrdresMissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const ordresMission = await OrdreMission.find()
      .populate("employe")
      .populate("mission");
    let filteredOMissions = ordresMission;

    if (user.role === "relex") throw new Error("Unauthorized");
    if (user.role === "responsable") {
      filteredOMissions = ordresMission.filter(
        (om) => om.mission.structure === user.structure
      );
    } else if (user.role === "employe") {
      //if error occured then change to user.id without toId
      filteredOMissions = ordresMission.filter(
        (om) => om.employe.id === user.id
      );
    }

    res.status(200).json(filteredOMissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOm = async (req, res) => {
  try {
    console.log(req.params.id);
    const ordreMission = await OrdreMission.findById(req.params.id)
      .populate("mission")
      .populate("employe");
      
    if (!ordreMission) {
      throw new Error("OrdreMission not found");
    }

    createOrUpdateFDocument(ordreMission, "OM", "delete");

    await ordreMission.remove();
    res.status(200).json({ msg: "OrdreMission deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
