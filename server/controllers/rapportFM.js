import RapportFM from "../models/RapportFM.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { createOrUpdateFDocument } from "./FilesKpis.js";
const toId = mongoose.Types.ObjectId;

export const updateRapport = async (req, res) => {
  try {
    const updatedReport = await RapportFM.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const populatedRFM = await RapportFM.findById(updatedReport._id)
      .populate("idMission")
      .populate("idEmploye");

    // createOrUpdateFDocument(populatedRFM, "RFM", "update");

    res.status(201).json({ updatedReport, msg: "updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

    // await createNotification(req, res, {
    //   users: [idEmploye],
    //   message:
    //     "Votre rapport de fin de mission à été créé , vous devez le remplir ",
    //   path: "",
    //   type: "",
    // });
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
    if (user.role === "relex") throw new Error("Unauthorized");
    else if (user.role === "employe") {
      filteredRapports = rapports.filter(
        (rapport) => rapport.idEmploye.id === req.user.id
      );
    } else {
      filteredRapports = rapports.filter((rapport) => rapport.etat !== "créé");
    }
    res.status(200).json(filteredRapports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
