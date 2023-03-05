import User from "../models/User.js";
import Mission from "../models/Mission.js";
import mongoose from "mongoose";
import OrdreMission from "../models/OrdreMission.js";
import { checkFields } from "../middleware/auth.js";
const toId = mongoose.Types.ObjectId;

export const createMission = async (req, res) => {
  try {
    const {
      objetMission,
      structure,
      type,
      budget,
      pays,
      employes,
      taches,
      tDateDeb,
      tDateRet,
      moyenTransport,
      lieuDep,
      destination,
      observation,
      etat,
      raisonRefus,
      circonscriptionAdm,
    } = req.body;
    const user = req.user;
    //si c est un responsable et la mission créée n appartient pas a sa structure
    if (user.role === "responsable" && user.structure !== structure)
      throw new Error("Unauthorized");

    let newEtat;
    //si c est le responsable/directeur qui l'a créée alors elle sera automatiquement acceptée
    if (user.role === "responsable" || user.role === "directeur")
      newEtat = "acceptée";
    else newEtat = etat;

    //check
    const fields = [
      objetMission,
      structure,
      type,
      budget,
      pays,
      employes,
      taches,
      tDateDeb,
      tDateRet,
      moyenTransport,
      lieuDep,
      destination,
      observation,
      circonscriptionAdm,
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
      structure,
      type,
      budget,
      pays,
      employes: newEmployes,
      taches,
      tDateDeb,
      tDateRet,
      moyenTransport,
      lieuDep,
      destination,
      observation,
      etat: newEtat,
      raisonRefus,
      circonscriptionAdm,
      createdBy,
      updatedBy,
    });

    const savedMission = await mission.save();
    if (newEtat === "acceptée" && newEmployes.length > 0) {
      //on doit générer l'ordre de mission
      const employeIds = newEmployes.map((employe) => employe._id);
      for (const employeId of employeIds) {
        const om = new OrdreMission({
          mission: savedMission.id,
          employe: employeId,
        });
        om.save();
      }
    }
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
    const missions = await Mission.find();
    let filteredMissions;

    if (user.role === "relex") throw new Error("Unauthorized");
    else if (user.role === "directeur" || user.role === "secretaire")
      filteredMissions = missions;
    else if (user.role === "employe") {
      //can read  his own missions only!
      filteredMissions = missions.filter((mission) =>
        mission.employes.includes(toId(user.id))
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

    if (newEtat === "acceptée" && employes.length > 0) {
      //on doit générer l'ordre de mission
      const employeIds = employes.map((employe) => employe._id);
      for (const employeId of employeIds) {
        const om = new OrdreMission({
          mission: savedMission.id,
          employe: employeId,
        });
        om.save();
      }
    }
    return res.status(200).json({
      updatedMission,
      msg: "mission state has been updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
