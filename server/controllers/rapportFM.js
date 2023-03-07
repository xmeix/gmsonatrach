import RapportFM from "../models/RapportFM.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const toId = mongoose.Types.ObjectId;

export const createRapport = async (req, res) => {
  try {
    let newRapport;
    const user = req.user;
    let missionnaire = toId(user.id);
    const { deroulement, idMission } = req.body;
    newRapport = new RapportFM({
      deroulement: deroulement,
      idMission: idMission,
      idEmploye: missionnaire,
    });
    const savedRapport = await newRapport.save();

    res.status(201).json({ savedRapport, msg: "created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllRapports = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const rapports = await RapportFM.find()
      .populate("idEmploye")
      .populate("idMission");
    let filteredRapports;
    if (user.role === 4) throw new Error("Unauthorized");
    else if (user.role === 3) {
      filteredRapports = rapports.filter(
        (rapport) => rapport.idEmploye.toString() === user.id
      );
    } else filteredRapports = rapports;
    res.status(200).json(filteredRapports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
