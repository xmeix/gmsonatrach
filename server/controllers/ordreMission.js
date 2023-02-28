import User from "../models/User.js";
import mongoose from "mongoose";
import OrdreMission from "../models/OrdreMission.js";
const toId = mongoose.Types.ObjectId;

export const createOrdreMission = async (req, res) => {
  try {
    //la creation d'une mission provoque la creation d'un ordre de mission pour chaqu un des employés qui y participent

    const { mission, employe } = req.body;

    const Mission = toId(mission);
    const Employe = toId(employe);

    const ordreMission = new OrdreMission({
      mission: Mission,
      employe: Employe,
    });

    const savedOMission = await ordreMission.save();
    //une fois crée on va changer l'etat de l'employé en missionnaire
    const emp = await User.findOne({ id: employe });
    emp.etat = "missionnaire";
    await emp.save();

    res.status(201).json({
      savedOMission,
      msg: "Ordre Mission créé avec succés",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrdresMissions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const ordresMission = await OrdreMission.find();
    if (user.role === 4) res.status(500).json({ error: "Unauthorized" });
    else if (user.role === 1 || user.role === 2)
      res.status(200).json({ ordresMission });
    else if (user.role === 3) {
      //if error occured then change to user.id without toId
      const filteredOMissions = ordresMission.filter(
        (om) => om.employe.toString() === toId(user.id).toString()
      );
      res.status(200).json({ filteredOMissions });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
