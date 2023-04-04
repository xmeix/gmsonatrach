import mongoose from "mongoose";
import FDocument from "../models/FDocument";
const toId = mongoose.Types.ObjectId;

export const createOrUpdateFDocument = async (newFile, fileType, operation) => {
  // Check if the new file is populated
  if (!newFile) {
    throw new Error("New file is not populated");
  }

  let struct;
  if (fileType === "RFM") {
    struct = newFile.idMission.structure;
  } else if (fileType === "DC" || fileType === "DM" || fileType === "DB") {
    struct = newFile.idEmetteur.structure;
  } else if (fileType === "OM") {
    struct = newFile.mission.structure;
  }

  try {
    switch (operation) {
      case "creation":
        // Find the most recent (using date) document with same type, structure, and etat === 'créé' || etat === 'en-attente'
        const mostRecent = await FDocument.findOne({
          type: fileType,
          structure: struct,
          etat: newFile.etat,
          nature: newFile.nature || "",
        }).sort({ date: -1 });

        // Duplicate the most recent document and increment the circulation_count field
        const newDocument = new FDocument({
          date: new Date(),
          structure: struct,
          etat: newFile.etat,
          type: fileType,
          nature: newFile.nature || "",
          circulation_count: mostRecent ? mostRecent.circulation_count + 1 : 1,
        });

        await newDocument.save();
        break;

      case "update":
        let oldEtat;
        switch (newFile.etat) {
          case "créé":
            oldEtat = "en-attente";
            break;
          case "en-attente":
            oldEtat = "créé";
            break;
          case "accepté":
          case "acceptée":
            oldEtat = "en-attente";
            break;
          case "refusé":
          case "refusée":
            oldEtat = "en-attente";
            break;
          default:
            throw new Error(`Invalid new file etat: ${newFile.etat}`);
        }

        // Find the most recent document with same type, structure, and old etat
        const oldDocument = await FDocument.findOne({
          type: fileType,
          structure: struct,
          etat: oldEtat,
          nature: newFile.nature || "",
        }).sort({ date: -1 });

        // Find the most recent document with same type, structure, and etat
        const recentDocument = await FDocument.findOne({
          type: fileType,
          structure: struct,
          etat: newFile.etat,
          nature: newFile.nature || "",
        }).sort({ date: -1 });

        // Duplicate the old document and decrement its circulation_count field
        if (oldDocument) {
          const updatedDocument = new FDocument({
            date: new Date(),
            structure: struct,
            etat: oldEtat,
            type: fileType,
            nature: newFile.nature || "",
            circulation_count: oldDocument.circulation_count - 1,
          });

          await updatedDocument.save();
        }

        // Duplicate the recent document and increment its circulation_count field
        if (recentDocument) {
          const updatedDocument = new FDocument({
            date: new Date(),
            structure: struct,
            etat: newFile.etat,
            type: fileType,
            nature: newFile.nature || "",
            circulation_count: recentDocument.circulation_count + 1,
          });

          await updatedDocument.save();
        }

        break;

      default:
        throw new Error(`Invalid operation: ${operation}`);
    }
  } catch (error) {
    // Handle any errors
    console.error(error);
  }
};

export const getFilesKPIS = async (req, res) => {
  try {
    const filesKpis = await FDocument.find().sort({ year: 1, month: 1 });
    res.status(200).json(filesKpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};