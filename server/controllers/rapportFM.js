import RapportFM from "../models/RapportFM.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { createOrUpdateFDocument } from "./FilesKpis.js";
import { createNotification } from "../controllers/Notification.js";
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
    const populatedRFM = await RapportFM.findById(req.params.id)
      .populate("idMission")
      .populate("idEmploye");

    /**_____________________________________________________________________________________________ */
    let newMsg;
    let users;
    //idEmploye
    if (req.body.etat === "créé") {
      //refusé
      newMsg = `Votre rapport de fin de mission a été refusé. Veuillez soumettre une nouvelle version dans les plus brefs délais.`;
      users = [updatedReport.idEmploye];
    } else if (req.body.etat === "accepté") {
      //accepté
      newMsg = `votre rapport de fin de mission a été accepté.`;
      users = [updatedReport.idEmploye];
    } else if (req.body.etat === "en-attente") {
      //en-attente
      newMsg = `vous avez reçu un nouveau rapport de fin de mission de la part de ${populatedRFM.idEmploye.nom} ${populatedRFM.idEmploye.prenom} .`;
      users = await User.find({
        $or: [
          { role: "responsable", structure: populatedRFM.idEmploye.structure },
          { role: "directeur" },
          { role: "secretaire" },
        ],
      });
    }
    if (
      req.body.etat === "créé" ||
      req.body.etat === "accepté" ||
      req.body.etat === "en-attente"
    ) {
      await createNotification(req, res, {
        users: users,
        message: newMsg,
        path: "",
        type: "",
      });
    }
    /**_____________________________________________________________________________________________ */
    createOrUpdateFDocument(populatedRFM, "RFM", "update");

    res.status(201).json({ updatedReport, msg: "updated successfully" });
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
