import Mission from "../models/Mission.js";
import RapportFM from "../models/RapportFM.js";
export const checkUpdateAccessReport = async (req, res, next) => {
  try {
    const role = req.user.role;
    const structure = req.user.structure;
    const Report = await RapportFM.findById(req.params.id);
    const mission = await Mission.findById(Report.idMission);

    //on doit savoir si someone want to change state or deroulement
    const { deroulement, etat } = req.body;
    if (deroulement) {
      if (role !== "employe") throw new Error("Unauthorized");
      else if (
        Report.etat === "accepté" ||
        Report.etat === "refusé" ||
        Report.etat === "créé"
      )
        throw new Error("Unauthorized");
    }

    if (etat) {
      if (etat === "en-attente" && role !== "employe")
        throw new Error("Unauthorized");
      if (etat === "accepté" || etat === "refusé") {
        if (role !== "responsable" && role !== "directeur")
          throw new Error("Unauthorized");
        else if (role === "responsable" && mission.structure !== structure)
          throw new Error("Unauthorized");
      } else if (etat === "créé") throw new Error("Unauthorized");
    }
    next(); //creation du rapport
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
