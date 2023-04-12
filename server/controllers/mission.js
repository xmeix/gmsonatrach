import User from "../models/User.js";
import Mission from "../models/Mission.js";
import mongoose from "mongoose";
import OrdreMission from "../models/OrdreMission.js";
import { checkFields } from "../middleware/auth.js";
import { createOrUpdateFDocument } from "./FilesKpis.js";
import { createOrUpdateFMission } from "./Kpis.js";
import { createNotification } from "./Notification.js";
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
      circonscriptionAdm,
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

    //check
    const fields = [
      objetMission,
      newStructure,
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
    ];

    if (!checkFields(fields)) {
      throw new Error("empty fields");
    }

    //const newTaches = taches.map((tache) => toId(tache));
    const newEmployes = employes.map((employe) => toId(employe));

    const createdBy = toId(req.user.id);
    const updatedBy = toId(req.user.id);

    const mission = new Mission({
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
      etat,
      circonscriptionAdm,
      createdBy,
      updatedBy,
    });
    const savedMission = await mission.save();
    if (etat === "acceptée" && newEmployes.length > 0) {
      //on doit générer l'ordre de mission et rfm
      const employeIds = newEmployes.map((employe) => employe._id);
      for (const employeId of employeIds) {
        const om = new OrdreMission({
          mission: savedMission.id,
          employe: employeId,
        });
        om.save();
        //______________________________________________________________;

        const populatedOM = await OrdreMission.findById(om._id)
          .populate("mission")
          .populate("employe");

        createOrUpdateFDocument(populatedOM, "OM", "creation");
        //______________________________________________________________;
      }
    }
    // ____________________________________________________________________________________;
    let newMsg;
    let users = [];
    if (etat !== "acceptée") {
      newMsg = "Vous avez reçu une nouvelle demande de mission.";
      users = await User.find({
        $or: [
          { role: "responsable", structure: savedMission.structure },
          { role: "directeur" },
        ],
      });
    } else {
      newMsg = "Vous avez été affecté(e) à une nouvelle mission de travail";
      users = newEmployes;
    }

    await createNotification(req, res, {
      users: users,
      message: newMsg,
      path: "",
      type: "",
    });
    // ____________________________________________________________________________________;
    createOrUpdateFMission(savedMission, "creation", null, "");
    if (savedMission.etat === "acceptée") {
      createOrUpdateFMission(savedMission, "update", null, "etat");
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
  try {
    const updatedBy = toId(req.user.id);
    const mission = await Mission.findById(req.params.id);
    const employes = mission.employes;

    const updatedMission = await Mission.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: updatedBy },
      { new: true }
    );

    if (req.body.etat) {
      const operation = req.body.etat;
      //si la mission est acceptée alors on va creer OM pr ts les employés qui y participent + RFM
      if (operation === "acceptée" && employes.length > 0) {
        //on doit générer l'ordre de mission
        const employeIds = employes.map((employe) => employe._id);
        for (const employeId of employeIds) {
          const om = new OrdreMission({
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
      if (operation === "acceptée" || operation === "refusée") {
        await createNotification(req, res, {
          users: [updatedMission.createdBy],
          message: `Votre demande de mission a été ${operation}.`,
          path: "",
          type: "",
        });
      } else if (operation === "annulée") {
        await createNotification(req, res, {
          users: updatedMission.employes,
          message: `Votre demande de mission a été ${operation}.`,
          path: "",
          type: "",
        });
      }

      if (
        operation === "acceptée" ||
        operation === "refusée" ||
        operation === "annulée"
      ) {
        //ne : updatedMission.createdBy
        await createNotification(req, res, {
          users: await User.find({
            $or: [
              { role: "responsable", structure: savedMission.structure },
              { role: "directeur" },
            ],
          }),
          message: `Une demande de mission a été ${operation}.`,
          path: "",
          type: "",
        });
      }

      //_________________________

      if (etat === "acceptée") {
        await createNotification(req, res, {
          users: employes,
          message: "Vous avez été affecté(e) à une nouvelle mission de travail",
          path: "",
          type: "",
        });
      }

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
