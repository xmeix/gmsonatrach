import User from "../models/User.js";
import Mission from "../models/Mission.js";
import mongoose from "mongoose";
const toId = mongoose.Types.ObjectId;

export const createMission = async (req, res) => {
  try {
    const {
      objetMission,
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
      circonscriptionAdm,
    } = req.body;

    const newTaches = taches.map((tache) => toId(tache));
    const newEmployes = employes.map((employe) => toId(employe));

    const mission = new Mission({
      objetMission: objetMission,
      type: type,
      budget: budget,
      pays: pays,
      employes: newEmployes,
      taches: newTaches,
      tDateDeb: tDateDeb,
      tDateRet: tDateRet,
      moyenTransport: moyenTransport,
      lieuDep: lieuDep,
      destination: destination,
      observation: observation,
      etat: etat,
      circonscriptionAdm: circonscriptionAdm,
    });

    const savedMission = await mission.save();
    res
      .status(201)
      .json({ savedMission, msg: "Mission has been created successfully" });
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
    if (user.role === 4) res.status(500).json({ error: "Unauthorized" });
    else if (user.role === 1 || user.role === 2)
      res.status(200).json({ missions });
    else if (user.role === 3) {
      //if error occured then change to user.id without toId
      filteredMissions = missions.filter((mission) =>
        mission.employes.includes(toId(user.id))
      );
    } else filteredDemandes = demandes;
    res.status(200).json(filteredDemandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMissionEtat = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (mission.etat === 1 && req.body.etat !== 1) {
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
