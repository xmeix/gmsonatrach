import mongoose from "mongoose";
import Mission from "../models/Mission.js";

/** UPDATE ETAT ==> ((SEC||DIR) && annuler ) || (DIR && (accepter || refuser)) */
export const checkUpdateMissionAccess = async (req, res, next) => {
  try {
    const mission = await Mission.findById(req.params.id);
    const operation = req.body.etat;
    const role = req.user.role;
    const structure = req.user.structure;
    const raisonRefus = req.body.raisonRefus;
    if (operation) {
      if (operation === "en-attente") throw new Error("Unauthorized");
      if (operation === mission.etat) throw new Error("Unauthorized");
      else if (role === "employe" || role === "relex")
        throw new Error("Unauthorized");
      else if (
        role === "secretaire" &&
        (operation === "acceptée" || operation === "refusée")
      )
        throw new Error("Unauthorized");
      else if (
        role === "responsable" &&
        (operation === "acceptée" || operation === "refusée") &&
        mission.structure !== structure
      )
        throw new Error("Unauthorized");
      //si mission pas en cours mais planifié (accepté) ==> ils peuvent l'annuler
      else if (
        operation === "annulée" &&
        (mission.etat === "en-cours" ||
          mission.etat !== "refusée" ||
          mission.etat !== "terminée")
      )
        throw new Error("Unauthorized");
      else if (
        role === "responsable" &&
        operation === "annulée" &&
        mission.structure !== structure
      )
        throw new Error("Unauthorized");
    } else if (!raisonRefus) throw new Error("Unauthorized");
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
