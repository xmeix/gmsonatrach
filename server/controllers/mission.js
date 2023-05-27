import User from "../models/User.js";
import Mission from "../models/Mission.js";
import mongoose from "mongoose";
import OrdreMission from "../models/OrdreMission.js";
import { checkFields } from "../middleware/auth.js";
import { createOrUpdateFDocument } from "./FilesKpis.js";
import { createOrUpdateFMission } from "./Kpis.js";
import { createNotification } from "./Notification.js";
import { generateCustomId } from "./utils.js";

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

    // //check
    // const fields = [
    //   objetMission,
    //   newStructure,
    //   type,
    //   budget,
    //   pays,
    //   employes,
    //   taches,
    //   tDateDeb,
    //   tDateRet,
    //   moyenTransport,
    //   moyenTransportRet,
    //   lieuDep,
    //   destination,
    // ];

    // if (!checkFields(fields)) {
    //   throw new Error("empty fields");
    // }

    //const newTaches = taches.map((tache) => toId(tache));
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
      tDateDeb,
      tDateRet,
      moyenTransport,
      moyenTransportRet,
      lieuDep,
      destination,
      observation,
      etat,
      // circonscriptionAdm,
      createdBy,
      updatedBy,
    });
    const savedMission = await mission.save();
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

        createOrUpdateFDocument(populatedOM, "OM", "creation");
        //______________________________________________________________;
      }
    }
    //____________________________________________________________________________________;
    const userObj = await User.findById(user.id);
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
    createOrUpdateFMission(query, "creation", null, "");

    if (savedMission.etat === "acceptée") {
      createOrUpdateFMission(savedMission, "update", query, "etat");
    }
    //____________________________________________________________________________________;

    res
      .status(201)
      .json({ savedMission, msg: "mission has been created successfully" });
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
    console.log("here1");
    console.log(req.body);
    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: updatedBy },
      { new: true }
    );
    console.log("here2");

    if (req.body.etat) {
      const operation = req.body.etat;
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
      console.log("here3");

      const populatedMission = await Mission.findById(updatedMission.id)
        .populate("createdBy")
        .populate("updatedBy");

      sendNotification("update", {
        mission,
        etat: updatedMission.etat,
        employes,
        createdBy: populatedMission.createdBy,
        updatedBy: populatedMission.updatedBy,
      });

      //____________________________________________________________________________________
      //update etat
      createOrUpdateFMission(updatedMission, "update", mission, "etat");
      //____________________________________________________________________________________
    }

    if (req.body.taches) {
      //____________________________________________________________________________________
      //update tache
      createOrUpdateFMission(updatedMission, "update", mission, "tache");
      //____________________________________________________________________________________
    }

    res.status(200).json({
      updatedMission,
      msg: "mission has been updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
          await createNotification({
            users: users,
            message: message,
            path,
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
          await createNotification({
            users: users2,
            message: message2,
            path,
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
          await createNotification({ users, message, path, type });
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
            await createNotification({ users, message, path, type });
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
          await createNotification({ users, message, path, type });
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
          await createNotification({ users, message, path, type });
        }

        // Send notification to all other employees assigned to the mission

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
        await createNotification({ users, message, path, type });
      }
      break;
    default:
      break;
  }
};
