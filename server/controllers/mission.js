import User from "../models/User.js";
import Mission from "../models/Mission.js";
import mongoose from "mongoose";
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

    //const newTaches = taches.map((tache) => toId(tache));
    const newEmployes = employes.map((employe) => toId(employe));

    const createdBy = toId(req.user.id);
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
      etat,
      raisonRefus,
      circonscriptionAdm,
      createdBy,
    });

    const savedMission = await mission.save();
    res.status(201).json({ savedMission, msg: "mission crée avec succés" });
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
    if (user.role === "relex") res.status(500).json({ error: "Unauthorized" });
    else if (user.role === "directeur" || user.role === "secretaire")
      res.status(200).json({ missions });
    else if (user.role === "employe") {
      //if error occured then change to user.id without toId
      filteredMissions = missions.filter((mission) =>
        mission.employes.includes(toId(user.id))
      );
    } else if (user.role === "responsable") {
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
    const mission = await Mission.findById(req.params.id);
    if (mission.etat !== req.body.etat && req.body.etat !== "en-attente") {
      const updatedMission = await Mission.findByIdAndUpdate(
        req.params.id,
        { etat: req.body.etat },
        { new: true }
      );
      return res
        .status(200)
        .json({ updatedMission, msg: "Updated successfully" });
    }
    return res.status(406).json({ error: "Unauthorized" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
