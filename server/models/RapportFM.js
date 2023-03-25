import mongoose from "mongoose";

const RapportFMSchema = new mongoose.Schema(
  {
    deroulement: [
      {
        IdDate: {
          type: Date,
        },
        hebergement: {
          type: String,
          enum: ["avec-prise-en-charge", "sans-prise-en-charge"],
          default: "avec-prise-en-charge",
        },
        dejeuner: {
          type: String,
          enum: ["avec-prise-en-charge", "sans-prise-en-charge"],
          default: "avec-prise-en-charge",
        },
        diner: {
          type: String,
          enum: ["avec-prise-en-charge", "sans-prise-en-charge"],
          default: "avec-prise-en-charge",
        },
        observation: {
          type: String,
          default: "",
        },
      },
    ],
    etat: {
      type: String,
      enum: ["créé", "en-attente", "accepté", "refusé"],
      default: "créé",
    },
    idMission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
      required: true,
    },
    idEmploye: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nbRefus: {
      type: Number,
      default: 0,
    },
    raisonRefus: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RapportFM = mongoose.model("RapportFM", RapportFMSchema);
export default RapportFM;
