import mongoose from "mongoose";

const RapportFMSchema = new mongoose.Schema(
  {
    deroulement: [
      {
        IdDate: {
          type: Date,
          required: true,
        },
        hebergement: {
          type: String,
          enum: ["avec-prise-en-charge", "sans-prise-en-charge"],
          required: true,
        },
        dejeuner: {
          type: String,
          enum: ["avec-prise-en-charge", "sans-prise-en-charge"],
          required: true,
        },
        diner: {
          type: String,
          enum: ["avec-prise-en-charge", "sans-prise-en-charge"],
          required: true,
        },
        observation: {
          type: String,
        },
      },
    ],
    motif: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const RapportFM = mongoose.model("RapportFM", RapportFMSchema);
export default RapportFM;
