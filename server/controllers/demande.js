import User from "../models/User.js";
import DC from "../models/demandes/DC.js";
import DM from "../models/demandes/DM.js";
import DB from "../models/demandes/DB.js";
import Demande from "../models/Demande.js";
import mongoose from "mongoose";
import Mission from "../models/Mission.js";
import { createOrUpdateFDocument } from "./FilesKpis.js";
import { createNotification } from "./Notification.js";
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

        if (new Date(DateDepart).getTime() < new Date().getTime()) {
          throw new Error(
            "La date de départ doit être postérieure à la date actuelle."
          );
        } else if (
          new Date(DateDepart).getTime() >= new Date(DateRetour).getTime()
        ) {
          throw new Error(
            "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ."
          );
        }

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
          depart,
          destination,
          paysDestination,
          direction,
          sousSection,
          division,
          base,
          gisement,
          employes,
        } = req.body;

        if (new Date(dateDepart).getTime() < new Date().getTime()) {
          throw new Error(
            "La date de départ doit être postérieure à la date actuelle."
          );
        } else if (
          new Date(dateDepart).getTime() >= new Date(dateRetour).getTime()
        ) {
          throw new Error(
            "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ."
          );
        }

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
          depart,
          destination,
          paysDestination,
          direction,
          sousSection,
          division,
          base,
          gisement,
          employes,
        });
        break;
      }
    }

    const savedDemande = await newDemande.save();
    //__________________________________________________
    let newMsg;
    let destinataires;
    if (type === "DB") {
      newMsg = "Vous avez reçu une nouvelle demande de billetterie.";
      destinataires = [destinataire];
    } else if (type === "DC") {
      newMsg = "Vous avez reçu une nouvelle demande de congés.";
      destinataires = await User.find({
        $or: [
          { role: "responsable", structure: structure },
          { role: { $in: ["secretaire", "directeur"] } },
        ],
      });
    } else if (type === "DM") {
      newMsg = "Vous avez reçu une nouvelle demande de modification.";
      destinataires = await User.find({
        $or: [
          { role: "responsable", structure: structure },
          { role: { $in: ["secretaire", "directeur"] } },
        ],
      });
    }

    await createNotification(req, res, {
      users: destinataires,
      message: newMsg,
      path: "",
      type: "",
    });
    //__________________________________________________
    // const populatedDemande = await Demande.findById(savedDemande._id)
    //   .populate("idEmetteur")
    //   .populate("idDestinataire");
    // createOrUpdateFDocument(populatedDemande,  populatedDemande.__t, "creation");

    res.status(201).json({ savedDemande, msg: "Demande envoyée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDemandes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let demandes = await Demande.find()
      .populate("idEmetteur")
      .populate("idDestinataire")
      ?.populate("employes");
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
      demande.etat = req.body.etat;

      demande.nbRefus =
        demande.etat === "refusée" ? demande.nbRefus + 1 : demande.nbRefus;
      demande.raisonRefus =
        demande.etat === "refusée" ? req.body.raisonRefus : demande.raisonRefus;

      const updatedDemande = await demande.save();
      //________________________________________________________________
      const populatedDemande = await Demande.findById(updatedDemande._id)
        .populate("idEmetteur")
        .populate("idDestinataire")
        ?.populate("employes");

      createOrUpdateFDocument(populatedDemande, populatedDemande.__t, "update");
      //________________________________________________________________
      let destinataires = await User.find({
        $or: [
          {
            role: "responsable",
            structure: populatedDemande.idEmetteur.structure,
          },
          { role: { $in: ["secretaire", "directeur"] } },
        ],
      });
      const relex = await User.find({ role: "relex" });

      // Check if the DC is accepted
      if (updatedDemande.type === "DC" && updatedDemande.etat === "acceptée") {
        const missions = await Mission.find({
          employes: { $in: [updatedDemande.createdBy] },
          tDateDeb: { $lte: updatedDemande.DateRetour },
          tDateRet: { $gte: updatedDemande.DateDepart },
          etat: { $ne: "annulée" },
        });

        for (const mission of missions) {
          if (
            mission.employes.length === 1 &&
            mission.employes[0]._id.equals(updatedDemande.createdBy)
          ) {
            mission.etat = "annulée";
            await mission.save();

            await createNotification(req, res, {
              users: [...destinataires, updatedDemande.createdBy, ...relex],
              message: `le voyage d'affaires prévu entre le ${mission.tDateDeb} et le ${mission.tDateRet} a été annulé`,
              path: "",
              type: "",
            });
          } else if (mission.employes.length > 1) {
            const employeId = updatedDemande.createdBy;
            mission.employes = mission.employes.filter(
              (employe) => !employe._id.equals(employeId)
            );
            await mission.save();

            await createNotification(req, res, {
              users: [updatedDemande.createdBy],
              message: `le voyage d'affaires prévu entre le ${mission.tDateDeb} et le ${mission.tDateRet} a été annulé`,
              path: "",
              type: "",
            });
          }
          const employeId = updatedDemande.createdBy;
          await User.updateOne(
            { _id: employeId },
            { $set: { etat: "non-missionnaire" } }
          );
        }
      }

      //____________________________________________________________________________________
      if (req.body.etat) {
        let users;
        let nomDem;
        if (updatedDemande.__t === "DC") {
          nomDem = "congés";
          users = [updatedDemande.idEmetteur];
        } else if (updatedDemande.__t === "DB") {
          if (updatedDemande.etat === "annulée") {
            await createNotification(req, res, {
              users: relex,
              message: `une demande de billetterie a été annulée.`,
              path: "",
              type: "",
            });
          }

          nomDem = "billetterie";
          users = await User.find({
            $or: [
              {
                role: "responsable",
                structure: populatedDemande.idEmetteur.structure,
              },
              { role: { $in: ["secretaire", "directeur"] } },
            ],
          });
        } else if (updatedDemande.__t === "DM") {
          nomDem = "modification";
          users = [updatedDemande.idEmetteur];
        }

        let newMsg = `Votre demande de ${nomDem} a été ${updatedDemande.etat}.`;

        await createNotification(req, res, {
          users: users,
          message: newMsg,
          path: "",
          type: "",
        });
      }
      //____________________________________________________________________________________

      res.status(200).json({ updatedDemande, msg: "Modifié avec succés" });
    } else {
      res.status(406).json({ error: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
