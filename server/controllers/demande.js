import User from "../models/User.js";
import DC from "../models/demandes/DC.js";
import DM from "../models/demandes/DM.js";
import DB from "../models/demandes/DB.js";
import Demande from "../models/Demande.js";
import mongoose from "mongoose";
const toId = mongoose.Types.ObjectId;

export const createDemande = async (req, res) => {
  try {
    if (res.headersSent) {
      return;
    }
    const type = req.params.type;
    const user = req.user;
    let newDemande;
    let destinataire;

    if (type === "DC") {
      destinataire = await User.findOne({ role: 1 });
    } else if (type === "DM") {
      destinataire = await User.findOne({ role: 2 });
    } else if (type === "DB") {
      destinataire = await User.findOne({ role: 4 });
    }

    destinataire = toId(destinataire.id);
    let emetteur = toId(user.id);
    switch (type) {
      case "DC": {
        const { motif } = req.body;
        newDemande = new DC({
          motif: motif,
          idEmetteur: emetteur,
          idDestinataire: destinataire,
        });
        break;
      }

      case "DM": {
        const { motif } = req.body;
        newDemande = new DM({
          motif: motif,
          idEmetteur: emetteur,
          idDestinataire: destinataire,
        });
        break;
      }

      case "DB": {
        const {
          motif,
          numSC,
          designationSC,
          montantEngage,
          nature,
          motifDep,
          observation,
          dateDepart,
          dateRetour,
        } = req.body;
        newDemande = new DB({
          motif: motif,
          idEmetteur: emetteur,
          idDestinataire: destinataire,
          numSC: numSC,
          designationSC: designationSC,
          montantEngage: montantEngage,
          nature: nature,
          motifDep: motifDep,
          observation: observation,
          dateDepart: dateDepart,
          dateRetour: dateRetour,
        });
        break;
      }
    }

    const savedDemande = await newDemande.save();
    return res
      .status(201)
      .json({ newDemande, msg: "Demande created successfully" });
  } catch (err) {
    console.log("errr: " + err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getDemandes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let demandes = await Demande.find();
    let filteredDemandes;
    //if relex ==> then allow all demande de billetterie //if secretaire ou directeur ==> allow all DC, DB , DM //if employe ===> allow only his own DC , DM
    if (user.role === 3 || user.role === 4) {
      filteredDemandes = demandes.filter(
        (demande) =>
          demande.idEmetteur.toString() === user.id ||
          demande.idDestinataire.toString() === user.id
      );
    } else filteredDemandes = demandes;
    res.status(200).json(filteredDemandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDemEtat = async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);

    if (demande.etat === 1 && req.body.etat !== 1) {
      const updatedDemande = await Demande.findByIdAndUpdate(
        req.params.id,
        { etat: req.body.etat },
        { new: true }
      );
      res.status(200).json({ updatedDemande, msg: "Updated successfully" });
    } else {
      res.status(406).json({ error: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
