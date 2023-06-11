import User from "../models/User.js";
import DC from "../models/demandes/DC.js";
import DM from "../models/demandes/DM.js";
import DB from "../models/demandes/DB.js";
import Demande from "../models/Demande.js";
import mongoose from "mongoose";
import Mission from "../models/Mission.js";
import { createOrUpdateFDocument } from "./FilesKpis.js";
import { emitGetData, generateCustomId } from "./utils.js";
import { createNotification } from "./Notification.js";
import OrdreMission from "../models/OrdreMission.js";
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

        sendDemEmits("create", {
          others: [emetteur],
          type: type,
          structure: structure,
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

        sendDemEmits("create", {
          others: [emetteur],
          type: type,
          structure: structure,
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

        sendDemEmits("create", {
          others: [emetteur],
          type: type,
          structure: "",
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
    if (user.role === "employe" || user.role === "relex") {
      filteredDemandes = demandes.filter(
        (demande) =>
          demande.idEmetteur._id.toString() === user._id.toString() ||
          demande.idDestinataire._id.toString() === user._id.toString()
      );
    } else if (user.role === "responsable") {
      filteredDemandes = demandes.filter(
        (demande) => demande.idEmetteur.structure === user.structure
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
      // ______________________________________________________________________________________________________
      //   IF DC ACCEPTED THEN CHECK IF THEY HAVE MISSIONS AT THAT TIME IF THEY DO, CANCEL THEM, and REMOVE OMS
      // ______________________________________________________________________________________________________
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
            // __________
            // CHANGE ETAT
            // __________
            mission.etat = "annulée";
            await mission.save();
            // __________
            // REMOVE OM
            // __________
            const om = await OrdreMission.findOne({
              mission: mission.id,
              employe: mission.employes[0],
            });

            if (om) {
              await om.remove();
            }

            createNotification({
              users: [...destinataires, updatedDemande.idEmetteur, ...relex],
              message: `la mission prévu entre le ${new Date(mission.tDateDeb)
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
              type: "mission",
            });
          } else if (mission.employes.length > 1) {
            const employeId = updatedDemande.idEmetteur;
            mission.employes = mission.employes.filter(
              (employe) => !employe.equals(employeId)
            );
            await mission.save();

            // _________________________________________
            // REMOVE OM OF THAT MISSION FOR THAT USER
            // _________________________________________
            const om = await OrdreMission.findOne({
              mission: mission.id,
              employe: employeId,
            });

            if (om) {
              await om.remove();
            }

            createNotification({
              users: [updatedDemande.idEmetteur],
              message: `votre mission prévue entre le ${new Date(
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
              type: "mission",
            });
          }
        }
      }

      //____________________________________________________________________________________
      if (req.body.etat) {
        const updatedBy = await User.findById(req.user.id);

        sendDemEmits("update", {
          others: [populatedDemande.idEmetteur._id],
          etat: "acceptée",
          type: updatedDemande.__t,
          structure: populatedDemande.idEmetteur.structure,
        });

        sendRequestNotification("update", {
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
const sendDemEmits = async (operation, ids) => {
  let { others, type } = ids;
  let users = [];
  switch (operation) {
    case "create":
      if (type === "DB") {
        users = await User.find({
          $or: [
            { role: "responsable" },
            { role: "directeur" },
            { role: "secretaire" },
            { role: "relex" },
            // { _id: user },
          ],
        })
          .select("_id")
          .lean();
        // Concatenate users and others arrays
        let combinedUsers = users.map((u) => u._id.toString());
        emitGetData(combinedUsers, "getDemandes");
      } else if (type === "DM" || type === "DC") {
        let { structure } = ids;
        users = await User.find({
          $or: [
            { role: "responsable", structure: structure },
            { role: "directeur" },
            { role: "secretaire" },
            // { _id: user },
          ],
        })
          .select("_id")
          .lean();
        // Concatenate users and others arrays
        let allUsers = users.map((u) => u._id.toString());
        let otherUsers = others.map((u) => u.toString());
        let combinedUsers = otherUsers.concat(allUsers);
        emitGetData(combinedUsers, "getDemandes");
      }
      break;

    case "update":
      let { etat, structure } = ids;
      if (type === "DB") {
        users = await User.find({
          $or: [
            { role: "responsable" },
            { role: "directeur" },
            { role: "secretaire" },
            { role: "relex" },
          ],
        })
          .select("_id")
          .lean();
        let combinedUsers = users.map((u) => u._id.toString());
        emitGetData(combinedUsers, "getDemandes");
      } else if (type === "DC" || type === "DM") {
        users = await User.find({
          $or: [
            { role: "responsable", structure: structure },
            { role: "directeur" },
            { role: "secretaire" },
          ],
        })
          .select("_id")
          .lean();
        if (etat === "acceptée" || etat === "refusée") {
          let allUsers = users.map((u) => u._id.toString());
          let otherUsers = others.map((u) => u.toString());
          let combinedUsers = otherUsers.concat(allUsers);

          if (type === "DC" && etat === "acceptée") {
            emitGetData(combinedUsers, "getMissions");
            emitGetData(combinedUsers, "getOms");
          }
          emitGetData(combinedUsers, "getDemandes");
        } else if (etat === "annulée") {
          let allUsers = users.map((u) => u._id.toString());
          emitGetData(allUsers, "getDemandes");
        }
      }

      break;

    default:
      break;
  }
};
const sendRequestNotification = async (operation, body) => {
  let path = "";
  let type = "demande";
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
          createNotification({
            users: users,
            message: message,
            path: "/service-relex",
            type: typeD,
          });

          //trouver les relex et leurs informer de la demande
          users2 = await User.find({ role: "relex" });
          message2 = `Vous avez reçu une nouvelle demande de billetterie de la part de ${idEmetteur.nom} ${idEmetteur.prenom}`;

          createNotification({
            users: users2,
            message: message2,
            path: "/",
            type: typeD,
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
          createNotification({
            users: users,
            message: message,
            path: "/gestion-c-m-rfm",
            type: typeD,
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
        roles = ["responsable", "secretaire", "directeur"]; //j ai enlevé relex
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
          createNotification({
            users,
            message,
            path:
              typeDemande === "DB"
                ? "/service-relex"
                : typeDemande === "DC"
                ? "/gestion-congés"
                : "/gestion-modification",
            type,
          });
        }
        users2 = await User.find({
          $and: [
            { role: { $in: roles } },
            { _id: { $ne: updatedBy._id } },
            { _id: { $ne: emetteur._id } },
          ],
        });

        message2 = `La demande de ${nomDemande} créée par ${emetteur.nom} ${emetteur.prenom} a été ${etat} par ${updatedBy.nom} ${updatedBy.prenom}`;
        createNotification({
          users: users2,
          message: message2,
          path:
            typeDemande === "DB"
              ? "/service-relex"
              : typeDemande === "DC"
              ? "/gestion-congés"
              : "/gestion-modification",
          type: typeDemande,
        });
      } else {
        // celui qui l a envoyé
        users = [emetteur.id];
        message = `Votre demande de  ${nomDemande}  a été ${etat} par ${updatedBy.nom} ${updatedBy.prenom}.`;
        createNotification({
          users: users,
          message: message,
          path:
            typeDemande === "DB"
              ? "/service-relex"
              : typeDemande === "DC"
              ? "/gestion-congés"
              : "/gestion-modification",
          type: typeDemande,
        });

        users2 = await User.find({
          $and: [
            { role: { $in: roles2 } },
            { _id: { $ne: emetteur._id } },
            { _id: { $ne: updatedBy._id } },
          ],
        });
        message2 = `La demande de  ${nomDemande}  créée par ${emetteur.nom} ${emetteur.prenom} a été ${etat} par ${updatedBy.nom} ${updatedBy.prenom}`;
        createNotification({
          users: users2,
          message: message2,
          path:
            typeDemande === "DB"
              ? "/service-relex"
              : typeDemande === "DC"
              ? "/gestion-congés"
              : "/gestion-modification",
          type: typeDemande,
        });
      }

      break;
    default:
      break;
  }
};
