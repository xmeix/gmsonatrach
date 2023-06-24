import User from "../models/User.js";
import Mission from "../models/Mission.js";
import mongoose from "mongoose";
import OrdreMission from "../models/OrdreMission.js";
import { checkFields } from "../middleware/auth.js";
import { createOrUpdateFDocument } from "./FilesKpis.js";
import { createOrUpdateFMission } from "./Kpis.js";
import { createNotification } from "./Notification.js";
import { emitGetData, generateCustomId } from "./utils.js";

const toId = mongoose.Types.ObjectId;

export const createMission = async (req, res) => {
  try {
    const {
      objetMission,
      structure, //si c est directeur ou la secretaire , si responsable on l enleve
      type,
      budget,
      pays,
      employes,
      taches,
      tDateDeb,
      tDateRet,
      moyenTransport,
      moyenTransportRet,
      lieuDep,
      destination,
      observation,
      // circonscriptionAdm,
    } = req.body;
    const user = req.user;
    let newStructure;
    //si c est un responsable et la mission créée n appartient pas a sa structure
    if (user.role === "responsable") {
      newStructure = user.structure;
    } else newStructure = structure;

    //verification dates start and end
    if (new Date(tDateDeb).getTime() >= new Date(tDateRet).getTime()) {
      throw new Error(
        "Les dates ne doivent pas être identiques, la date de retour doit être postérieure à la date de départ."
      );
    }

    let etat;
    //si c est le responsable/directeur qui l'a créée alors elle sera automatiquement acceptée
    if (user.role === "responsable" || user.role === "directeur") {
      etat = "acceptée";
    }

    const newEmployes = employes.map((employe) => toId(employe));

    const createdBy = toId(req.user.id);
    const updatedBy = toId(req.user.id);
    let newId = await generateCustomId(newStructure, "missions");

    const mission = new Mission({
      uid: newId,
      objetMission: objetMission,
      structure: newStructure,
      type,
      budget,
      pays,
      employes: newEmployes,
      taches: taches ? taches : [],
      tDateDeb: new Date(tDateDeb).toISOString(),
      tDateRet: new Date(tDateRet).toISOString(),
      moyenTransport,
      moyenTransportRet,
      lieuDep: lieuDep ? lieuDep : "Alger",
      destination,
      observation,
      etat,
      // circonscriptionAdm,
      createdBy,
      updatedBy,
    });
    const savedMission = await mission.save();
    // ___________________________________________________________________________________________________
    //                      GENERATION OM SI ETAT MISSION ACCEPTEE POUR CHAQUE EMPLOYE
    // ___________________________________________________________________________________________________
    if (etat === "acceptée" && newEmployes.length > 0) {
      //on doit générer l'ordre de mission et rfm
      const employeIds = newEmployes.map((employe) => employe._id);
      for (const employeId of employeIds) {
        let customId = await generateCustomId(newStructure, "ordremissions");
        const om = new OrdreMission({
          uid: customId,
          mission: savedMission.id,
          employe: employeId,
        });
        await om.save();
        //______________________________________________________________;
        const populatedOM = await OrdreMission.findById(om._id)
          .populate("mission")
          .populate("employe");
        // ___________________________________________________________________________________________________
        //                      CREATION FDOCUMENT
        // ___________________________________________________________________________________________________
        createOrUpdateFDocument(populatedOM, "OM", "creation");
        //______________________________________________________________;
      }
    }
    //____________________________________________________________________________________;
    const userObj = await User.findById(user.id);
    sendEmits("create", {
      user: userObj._id,
      others:
        etat === "acceptée" ? newEmployes.map((employe) => employe._id) : [],
      structure,
    });
    sendNotification("creation", {
      mission: savedMission,
      employes: newEmployes,
      user: userObj,
    });

    const query = {
      uid: newId,
      objetMission: objetMission,
      structure: newStructure,
      type,
      budget,
      pays,
      employes: newEmployes,
      taches,
      tDateDeb,
      tDateRet,
      moyenTransport,
      moyenTransportRet,
      lieuDep,
      destination,
      observation,
      etat: "en-attente",
      // circonscriptionAdm,
      createdBy,
      updatedBy,
    };
    // ____________________________________________________________________________________;
    // createOrUpdateFMission(query, "creation", null, "");
    await createOrUpdateFMission("creation", {
      newMission: query,
    });
    if (savedMission.etat === "acceptée") {
      // createOrUpdateFMission(savedMission, "update", query, "etat"); //---------------------------------------------XXXXXXXX
      await createOrUpdateFMission("update", {
        oldMission: query,
        newMission: savedMission,
        updateType: "etat",
      });
    }
    //____________________________________________________________________________________;

    res.status(201).json({ savedMission, msg: "mission créée avec succés" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//toutes les missions (SEC && DIR peuvent voir toutes missions , EMP Peut voir ses missions seulement )
export const getAllMissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const missions = await Mission.find()
      .populate("createdBy")
      .populate("updatedBy")
      .populate("employes");
    let filteredMissions;

    if (user.role === "relex") throw new Error("Unauthorized");
    else if (user.role === "employe") {
      //can read  his own missions only!
      filteredMissions = missions.filter(
        (mission) =>
          mission.employes.some((employe) => employe.id === user.id) &&
          (mission.etat === "en-cours" ||
            mission.etat === "acceptée" ||
            mission.etat === "terminée")
      );
    } else if (user.role === "responsable") {
      //can read the missions from his own structure only!
      filteredMissions = missions.filter(
        (mission) => mission.structure === req.user.structure
      );
    } else filteredMissions = missions;

    res.status(200).json(filteredMissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMissionEtat = async (req, res) => {
  console.log("__________________Updating___________________");
  try {
    const updatedBy = toId(req.user.id);
    const mission = await Mission.findById(req.params.id);
    const employes = mission.employes;

    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: updatedBy },
      { new: true }
    );

    const populatedMission = await Mission.findById(updatedMission.id)
      .populate("createdBy")
      .populate("updatedBy")
      .populate("employes");
    if (req.body.etat) {
      const operation = req.body.etat;
      // ________________________________________________________________________________________
      //             CREATION OM POUR CHAQUE EMPLOYE SI LA MISSION EST ACCEPTEE
      // ________________________________________________________________________________________
      //si la mission est acceptée alors on va creer OM pr ts les employés qui y participent + RFM
      if (operation === "acceptée" && employes.length > 0) {
        //on doit générer l'ordre de mission
        const employeIds = employes.map((employe) => employe._id);
        for (const employeId of employeIds) {
          let customId = await generateCustomId(
            mission.structure,
            "ordremissions"
          );
          const om = new OrdreMission({
            uid: customId,
            mission: toId(req.params.id),
            employe: employeId,
          });

          await om.save();

          const populatedOM = await OrdreMission.findById(om.id)
            .populate("mission")
            .populate("employe");

          createOrUpdateFDocument(populatedOM, "OM", "creation");
          //______________________________________________________________
        }
      }
      // ________________________________________________________________________________________
      //          DELETE ALL OMS RELATED TO A MISSION IF A MISSION HAVE BEEN CANCELED
      // ________________________________________________________________________________________
      if (operation === "annulée") {
        const oms = await OrdreMission.find({ mission: toId(req.params.id) });
        if (oms.length > 0) {
          for (const om of oms) {
            await om.remove();
          }
        }
      }

      sendEmits("update", {
        others: employes.map((employe) => employe),
        structure: mission.structure,
        etat: operation,
      });

      sendNotification("update", {
        mission,
        etat: updatedMission.etat,
        employes,
        createdBy: populatedMission.createdBy,
        updatedBy: populatedMission.updatedBy,
      });

      //____________________________________________________________________________________
      //update etat
      // createOrUpdateFMission(updatedMission, "update", mission, "etat");
      // console.log("old:", mission.etat);
      // console.log("new:", updatedMission.etat);
      createOrUpdateFMission("update", {
        oldMission: mission,
        newMission: updatedMission,
        updateType: "etat",
      });
      //____________________________________________________________________________________
    }

    if (req.body.taches) {
      sendEmits("update", {
        others: employes.map((employe) => employe._id),
        structure: mission.structure,
        etat: "taches",
      });
      //____________________________________________________________________________________
      //update tache
      // createOrUpdateFMission(updatedMission, "update", mission, "tache");
      createOrUpdateFMission("update", {
        oldMission: mission, //we wont really need it
        newMission: updatedMission,
        updateType: "tache",
      });
      //____________________________________________________________________________________
    }

    if (req.body.tDateRet) {
      sendEmits("update", {
        others: employes.map((employe) => employe._id),
        structure: mission.structure,
        etat: "date",
      });
      sendNotification("date", {
        mission,
        employes,
        updatedBy: populatedMission.updatedBy,
      });

      createOrUpdateFMission("update", {
        oldMission: mission, //neither this
        newMission: updatedMission,
        updateType: "date",
      });
    }

    if (req.body.budgetConsome) {
      sendEmits("update", {
        others: [],
        structure: mission.structure,
        etat: "budget",
      });
      createOrUpdateFMission("update", {
        oldMission: mission, //neither this
        newMission: updatedMission,
        updateType: "budget",
      });
    }

    res.status(200).json({
      updatedMission,
      msg: "mission has been updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendEmits = async (operation, ids) => {
  let { others, structure } = ids;
  let users = [];
  const commonUserQuery = {
    $or: [
      { role: "responsable", structure: structure },
      { role: "directeur" },
      { role: "secretaire" },
    ],
  };

  switch (operation) {
    case "create":
      users = await User.find(commonUserQuery).select("_id").lean();
      // Concatenate users and others arrays
      let allUsers = users.map((u) => u._id.toString());
      let otherUsers = others.map((u) => u._id.toString());
      let combinedUsers = otherUsers.concat(allUsers);
      emitGetData(combinedUsers, "getMissions");
      emitGetData(combinedUsers, "getOms");
      break;

    case "update":
      let { etat } = ids;
      users = await User.find(commonUserQuery).select("_id").lean();

      if (etat === "acceptée" || etat === "annulée") {
        let allUsers = users.map((u) => u._id.toString());
        let otherUsers = others.map((u) => u._id.toString());
        let combinedUsers = otherUsers.concat(allUsers);
        emitGetData(combinedUsers, "getMissions");
        emitGetData(combinedUsers, "getOms");
      } else if (etat === "refusée") {
        let combinedUsers = users.map((u) => u._id.toString());
        emitGetData(combinedUsers, "getMissions");
      } else if (etat === "taches") {
        let allUsers = users.map((u) => u._id.toString());
        let otherUsers = others.map((u) => u._id.toString());
        let combinedUsers = otherUsers.concat(allUsers);
        emitGetData(combinedUsers, "getMissions");
      } else if (etat === "date" || etat === "budget") {
        let allUsers = users.map((u) => u._id.toString());
        let otherUsers = others.map((u) => u._id.toString());
        let combinedUsers = otherUsers.concat(allUsers);
        emitGetData(combinedUsers, "getMissions");
        emitGetData(combinedUsers, "getOms");
        emitGetData(combinedUsers, "getRfms");
      }
      break;

    default:
      break;
  }
};

const sendNotification = async (operation, body) => {
  let users;
  let message;
  let path = "mission";
  let type = "";
  switch (operation) {
    case "creation":
      {
        const { mission, employes, user } = body;

        if (user.role === "directeur" || user.role === "responsable") {
          users = employes;
          message = `Vous avez été affecté(e) à une nouvelle mission de travail de ${mission.tDateDeb} a ${mission.tDateRet}`;
          createNotification({
            users: users,
            message: message,
            path: "/gestion-des-mission/oms",
            type,
          });

          let users2 = await User.find({
            $and: [
              {
                $or: [
                  { role: "responsable", structure: mission.structure },
                  { role: "directeur" },
                  { role: "secretaire" },
                ],
              },
              { _id: { $ne: toId(user.id) } },
            ],
          });
          let message2 = `une nouvelle mission de ${new Date(mission.tDateDeb)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-")} a ${new Date(mission.tDateRet)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-")} a été créé par ${user.nom} ${user.prenom}`;
          createNotification({
            users: users2,
            message: message2,
            path: "/gestion-des-mission",
            type,
          });
        } else {
          //tous les responsable avec meme mission structure , et les directeurs
          const query = {
            $or: [
              { role: "responsable", structure: mission.structure },
              { role: "directeur" },
            ],
          };
          users = await User.find(query);
          message = `Vous avez reçu une nouvelle demande de mission de la part de  ${user.nom} ${user.prenom}`;
          createNotification({
            users,
            message,
            path: "/gestion-des-mission",
            type,
          });
        }
      }
      break;
    case "update":
      {
        const { mission, etat, employes, createdBy, updatedBy } = body;

        if (etat === "annulée") {
          if (mission.etat === "acceptée") {
            message = `Votre mission prévu pour ${new Date(mission.tDateDeb)
              .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\//g, "-")} a ${new Date(mission.tDateRet)
              .toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\//g, "-")} a été ${etat}.`;
            users = employes;
            createNotification({
              users,
              message,
              path: "/gestion-des-mission",
              type,
            });
          }
        } else if (etat === "acceptée") {
          //envoyer a tous les employés
          users = employes;
          message = `Vous avez été affecté(e) à une nouvelle mission de travail de ${new Date(
            mission.tDateDeb
          )
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-")} a ${new Date(mission.tDateRet)
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\//g, "-")}`;
          createNotification({
            users,
            message,
            path: "/gestion-des-mission/oms",
            type,
          });
        }

        //on envoie pas de notification pour celui qui a créer la mission et l as annuler (created it === updatedit)
        //on envoie aux autres pour leurs dire que leurs mission a ete annulée par qqn  (those who created IT )
        //on envoie aux autres pour leurs dire qu'UNE mission de .. a .. a ete annulée par qqn (those who didnt create and didnt update ? )

        message = `La ${
          mission.etat === "acceptée" ? "" : "demande"
        } mission prévue pour ${new Date(mission.tDateDeb)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "-")} a ${new Date(mission.tDateRet)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "-")} a été ${etat} par ${updatedBy.nom} ${
          updatedBy.prenom
        }.`;

        if (updatedBy.id !== createdBy.id) {
          // Send notification to the creator of the mission
          users = [createdBy];
          await createNotification({
            users,
            message,
            path: "/gestion-des-mission",
            type,
          });
        }

        // Send notification to all other employees

        users = await User.find({
          $and: [
            {
              $or: [
                { role: "responsable", structure: mission.structure },
                { role: "directeur" },
                { role: "secretaire" },
              ],
            },
            { _id: { $ne: toId(createdBy.id) } },
            { _id: { $ne: toId(updatedBy.id) } },
          ],
        });
        createNotification({
          users,
          message,
          path: "/gestion-des-mission",
          type,
        });
      }
      break;
    case "date":
      const { mission, employes, updatedBy } = body;

      users = await User.find({
        $and: [
          {
            $or: [
              { role: "responsable", structure: mission.structure },
              { role: "directeur" },
              { role: "secretaire" },
            ],
          },
          { _id: { $ne: toId(updatedBy.id) } },
        ],
      });

      createNotification({
        users: [...users, ...employes.map((e) => e._id)],
        message: `la date de fin de mission prévue pour ${new Date(
          mission.tDateDeb
        )
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "-")} a été modifié par ${updatedBy.nom} ${
          updatedBy.prenom
        } `,
        path: " /gestion-des-mission",
        type,
      });

      break;
    default:
      break;
  }
};
