import mongoose from "mongoose";
import Mission from "../models/Mission.js";

/** UPDATE ETAT ==> ((SEC||DIR) && annuler ) || (DIR && (accepter || refuser)) */
export const checkUpdateMissionAccess = async (req, res, next) => {
  try {
    const missionId = await Mission.findById(req.params.id);
    const operation = req.body.etat;
    const role = req.user.role;

    if ((operation === 2 || operation === 3) && role !== 1) {
      throw new Error("Unauthorized");
    } else if (operation === 4 && role !== 1 && role !== 2) {
      throw new Error("Unauthorized");
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
