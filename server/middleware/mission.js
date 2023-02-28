import mongoose from "mongoose";
import Mission from "../models/Mission.js";

/** UPDATE ETAT ==> ((SEC||DIR) && annuler ) || (DIR && (accepter || refuser)) */
export const checkUpdateMissionAccess = async (req, res, next) => {
  try {
    const mission = await Mission.findById(req.params.id);
    const operation = req.body.etat;
    const role = req.user.role;
    const structure = req.user.structure;

    if (operation === mission.etat) throw new Error("Unauthorized");
    else if (role === "employe" || role === "relex")
      throw new Error("Unauthorized");
    else if (
      role === "secretaire" &&
      (operation === "acceptée" || operation === "refusée")
    )
      throw new Error("Unauthorized");
    else if (role === "directeur" && operation === "annulée")
      throw new Error("Unauthorized");
    else if (
      role === "responsable" &&
      (operation === "acceptée" || operation === "refusée") &&
      mission.structure !== structure
    )
      throw new Error("Unauthorized");
    else if (operation === "terminée")
      // else if (
      //   role === "responsable" &&
      //   operation === "annulée" &&
      //   mission.createdBy.toString() !== req.user.id
      // )
      //   throw new Error("Unauthorized");

      next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
