import User from "../models/User.js";
import DC from "../models/demandes/DC.js";
import DM from "../models/demandes/DM.js";
import DB from "../models/demandes/DB.js";
import Demande from "../models/Demande.js";
import mongoose from "mongoose";
import Mission from "../models/Mission.js";
import { createOrUpdateFDocument } from "./FilesKpis.js";
import { generateCustomId } from "./utils.js";
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
        const customId = await generateCustomId(structure, "demandes");
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
          uid: customId,
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
        const customId = await generateCustomId(structure, "demandes");

        newDemande = new DM({
          uid: customId,
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
        const customId = await generateCustomId("RELEX", "demandes");

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
          uid: customId,
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
    const populatedDemande = await Demande.findById(savedDemande.id)
      .populate("idEmetteur")
      .populate("idDestinataire");

    sendRequestNotification("creation", {
      demande: populatedDemande,
    });

    createOrUpdateFDocument(populatedDemande, populatedDemande.__t, "creation");

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
    // console.log("DEMANDE__________________________________________");
    // console.log(req.body.etat);
    // console.log("______________________________________________");

    if (demande.etat === "en-attente" && req.body.etat !== "en-attente") {
      demande.etat = req.body.etat;

      demande.nbRefus =
        demande.etat === "refusée" ? demande.nbRefus + 1 : demande.nbRefus;
      demande.raisonRefus =
        demande.etat === "refusée" ? req.body.raisonRefus : demande.raisonRefus;

      const updatedDemande = await demande.save();
      // console.log("DEMANDE__________________________________________");
      // console.log(updatedDemande.etat);
      // console.log("______________________________________________");
      //________________________________________________________________
      const populatedDemande = await Demande.findById(updatedDemande.id)
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
      if (updatedDemande.__t === "DC" && updatedDemande.etat === "acceptée") {
        const missions = await Mission.find({
          employes: updatedDemande.idEmetteur,
          $or: [
            {
              $and: [
                { tDateDeb: { $lte: updatedDemande.DateRetour } },
                { tDateRet: { $gte: updatedDemande.DateDepart } },
              ],
            },
            {
              $and: [
                { tDateDeb: { $gte: updatedDemande.DateDepart } },
                { tDateRet: { $lte: updatedDemande.DateRetour } },
              ],
            },
            {
              $and: [
                { tDateDeb: { $lte: updatedDemande.DateDepart } },
                { tDateRet: { $gte: updatedDemande.DateRetour } },
              ],
            },
          ],
          etat: { $nin: ["annulée", "refusée", "terminée"] },
        });

        for (const mission of missions) {
          if (
            mission.employes.length === 1 &&
            mission.employes[0].equals(updatedDemande.idEmetteur)
          ) {
            console.log("here1");
            mission.etat = "annulée";
            await mission.save();

            await createNotification({
              users: [...destinataires, updatedDemande.idEmetteur, ...relex],
              message: `le voyage d'affaires prévu entre le ${new Date(
                mission.tDateDeb
              )
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-")} et le ${new Date(mission.tDateRet)
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-")} a été annulé`,
              path: "",
              type: "",
            });
          } else if (mission.employes.length > 1) {
            console.log("here2");
            const employeId = updatedDemande.idEmetteur;
            mission.employes = mission.employes.filter(
              (employe) => !employe.equals(employeId)
            );
            await mission.save();

            await createNotification({
              users: [updatedDemande.idEmetteur],
              message: `votre voyage d'affaires prévu entre le ${new Date(
                mission.tDateDeb
              )
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-")} et le ${new Date(mission.tDateRet)
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .replace(/\//g, "-")} a été annulé`,
              path: "",
              type: "",
            });
          }
        }
      }

      //____________________________________________________________________________________
      if (req.body.etat) {
        const updatedBy = await User.findById(req.user.id);

        await sendRequestNotification("update", {
          oldDemande: populatedDemande,
          etat: req.body.etat,
          updatedBy: updatedBy,
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

const sendRequestNotification = async (operation, body) => {
  let path = "";
  let type = "";
  let users;
  let message;
  let users2;
  let message2;

  switch (operation) {
    case "creation":
      let { demande } = body;
      let { idEmetteur, __t: typeD } = demande;

      switch (typeD) {
        case "DB":
          users = await User.find({
            $and: [
              {
                $or: [
                  { role: "responsable" },
                  { role: "directeur" },
                  { role: "secretaire" },
                ],
              },
              { _id: { $ne: idEmetteur._id } },
            ],
          });
          // console.log("users ============>", users);
          message = `une demande de billetterie a été créé par ${idEmetteur.nom} ${idEmetteur.prenom}`;
          await createNotification({
            users: users,
            message: message,
            path,
            type,
          });

          //trouver les relex et leurs informer de la demande
          users2 = await User.find({ role: "relex" });
          message2 = `Vous avez reçu une nouvelle demande de billetterie de la part de ${idEmetteur.nom} ${idEmetteur.prenom}`;

          await createNotification({
            users: users2,
            message: message2,
            path,
            type,
          });

          break;

        case "DC":
        case "DM":
          users = await User.find({
            $and: [
              {
                $or: [
                  { role: "responsable", structure: idEmetteur.structure },
                  { role: "directeur" },
                ],
              },
              { _id: { $ne: idEmetteur._id } },
            ],
          });

          message = `Vous avez reçu une nouvelle demande de ${
            typeD === "DM" ? "modification" : "congés"
          } de la part de ${idEmetteur.nom} ${idEmetteur.prenom}`;
          await createNotification({
            users: users,
            message: message,
            path,
            type,
          });
          break;

        default:
          break;
      }

      break;
    case "update":
      const { oldDemande, etat, updatedBy } = body;
      const { __t: typeDemande, idEmetteur: emetteur } = oldDemande;

      let nomDemande;
      let roles;
      let roles2;

      if (typeDemande === "DB") {
        nomDemande = "billetterie";
        roles = ["responsable", "secretaire", "directeur", "relex"];
        roles2 = ["responsable", "secretaire", "directeur"];
      } else if (typeDemande === "DC") {
        nomDemande = "congés";
        roles = ["responsable", "directeur"]; //annuler
        roles2 = ["responsable", "directeur"]; //accepter refuser
      } else if (typeDemande === "DM") {
        nomDemande = "modification";
        roles = ["responsable", "directeur"]; //annuler
        roles2 = ["responsable", "directeur"]; //accepter refuser
      }
      if (etat === "annulée") {
        //celui qui l as annulée c est pas celui quui l as envoyer
        if (updatedBy.id !== emetteur.id) {
          users = [emetteur.id];
          message = `Votre demande de ${nomDemande} a été ${etat} par ${updatedBy.nom} ${updatedBy.prenom}`;
          await createNotification({ users, message, path, type });
        }
        users2 = await User.find({
          $and: [
            { role: { $in: roles } },
            { _id: { $ne: updatedBy._id } },
            { _id: { $ne: emetteur._id } },
          ],
        });

        message2 = `La demande de  ${nomDemande}  créée par ${emetteur.nom} ${emetteur.prenom} a été ${etat} par ${updatedBy.nom} ${updatedBy.prenom}`;
        await createNotification({
          users: users2,
          message: message2,
          path,
          type,
        });
      } else {
        users = [emetteur.id];
        message = `Votre demande de  ${nomDemande}  a été ${etat} par ${updatedBy.nom} ${updatedBy.prenom}.`;
        await createNotification({
          users: users,
          message: message,
          path,
          type,
        });

        users2 = await User.find({
          $and: [
            { role: { $in: roles2 } },
            { _id: { $ne: emetteur._id } },
            { _id: { $ne: updatedBy._id } },
          ],
        });
        message2 = `La demande de  ${nomDemande}  créée par ${emetteur.nom} ${emetteur.prenom} a été ${etat} par ${updatedBy.nom} ${updatedBy.prenom}`;
        await createNotification({
          users: users2,
          message: message2,
          path,
          type,
        });
      }

      break;
    default:
      break;
  }
};
