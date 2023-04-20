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
    const populatedRFM = await RapportFM.findById(updatedReport.id)
      .populate("idMission")
      .populate("idEmploye");

    sendRFMNotification({
      etat: req.body.etat,
      rfm: populatedRFM,
    });
    /**_____________________________________________________________________________________________ */

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

const sendRFMNotification = async (body) => {
  let path = "";
  let type = "";
  let users;
  let message; 
  const { rfm, etat } = body;
 
  //idEmploye
  if (etat === "créé") {
    //refusé
    message = `Votre rapport de fin de mission a été refusé. Veuillez soumettre une nouvelle version dans les plus brefs délais.`;
    users = [rfm.idEmploye._id];
  } else if (etat === "accepté") {
    //accepté
    message = `votre rapport de fin de mission a été accepté.`;
    users = [rfm.idEmploye._id];
  } else if (etat === "en-attente") {
    //en-attente
    message = `vous avez reçu un nouveau rapport de fin de mission de la part de ${rfm.idEmploye.nom} ${rfm.idEmploye.prenom} .`;
    users = await User.find({
      $or: [
        { role: "responsable", structure: rfm.idEmploye.structure },
        { role: "directeur" },
        { role: "secretaire" },
      ],
    });
  }
  if (etat === "créé" || etat === "accepté" || etat === "en-attente") {
    await createNotification({
      users: users,
      message: message,
      path,
      type,
    });
  }
};
