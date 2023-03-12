import User from "../models/User.js";
import DC from "../models/demandes/DC.js";
import DM from "../models/demandes/DM.js";
import DB from "../models/demandes/DB.js";
import Demande from "../models/Demande.js";
import mongoose from "mongoose";
import Mission from "../models/Mission.js";
const toId = mongoose.Types.ObjectId;

export const createDemande = async (req, res) => {
  try {
    if (res.headersSent) {
      return;
    }
    const type = req.params.type;
    const structure = req.user.structure;
    const user = req.user;
    let newDemande;
    let destinataire;

    if (type === "DM" || type === "DC") {
      destinataire = await User.findOne({
        role: "responsable",
        structure: structure,
      });
    } else if (type === "DB") {
      destinataire = await User.findOne({ role: "relex" });
    }

    destinataire = toId(destinataire.id);
    let emetteur = toId(user.id);
    switch (type) {
      case "DC": {
        const { motif, DateDepart, DateRetour, LieuSejour, Nature } = req.body;

        if (new Date(DateDepart).getTime() >= new Date(DateRetour).getTime())
          throw new Error(
            "Dates shouldn't be equal, return date should be greater than departure date"
          );

        newDemande = new DC({
          motif,
          DateDepart,
          DateRetour,
          LieuSejour,
          Nature,
          idEmetteur: emetteur,
          idDestinataire: destinataire,
        });
        break;
      }

      case "DM": {
        const { motif } = req.body;
        newDemande = new DM({
          motif,
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
          motif,
          idEmetteur: emetteur,
          idDestinataire: destinataire,
          numSC,
          designationSC,
          montantEngage,
          nature,
          motifDep,
          observation,
          dateDepart,
          dateRetour,
        });
        break;
      }
    }

    const savedDemande = await newDemande.save();
    return res.status(201).json({ savedDemande, msg: "Demande envoyée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getDemandes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let demandes = await Demande.find()
      .populate("idEmetteur")
      .populate("idDestinataire");
    let filteredDemandes;
    /**
     * emp : get his DC , DM
     * responsable : get demandes d'une structure
     * directeur / secretaire : get All demandes
     * relex : get only db
     */
    if (
      user.role === "employe" ||
      user.role === "relex" ||
      user.role === "responsable"
    ) {
      filteredDemandes = demandes.filter(
        (demande) =>
          demande.idEmetteur._id.toString() === user._id.toString() ||
          demande.idDestinataire._id.toString() === user._id.toString()
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

    if (demande.etat === "en-attente" && req.body.etat !== "en-attente") {
      const updatedDemande = await Demande.findByIdAndUpdate(
        req.params.id,
        { etat: req.body.etat },
        { new: true }
      );

      // Check if the DC is accepted
      if (updatedDemande.type === "DC" && updatedDemande.etat === "acceptée") {
        const missions = await Mission.find({
          employes: updatedDemande.createdBy,
          tDateDeb: { $lte: updatedDemande.DateRetour },
          tDateRet: { $gte: updatedDemande.DateDepart },
          etat: { $ne: "annulée" },
        });

        for (const mission of missions) {
          mission.etat = "annulée";
          await mission.save();
        }
      }

      res.status(200).json({ updatedDemande, msg: "Modifié avec succés" });
    } else {
      res.status(406).json({ error: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
