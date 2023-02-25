import mongoose from "mongoose";

const MissionSchema = new mongoose.Schema(
  {
    objetMission: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      default: 1,
    },
    budget: {
      type: Number,
      required: true,
    },
    pays: {
      type: String,
      required: true,
    },
    employes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ]
    ,
    taches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tache',
        required: true,
      },
    ],
    tDateDeb: [
      {
        type: Date,
        required: true,
      }
    ],
    tDateRet: [
      {
        type: Date,
        required: true,
      },
    ],
    moyenTransport: {
      type: String,
      required: true,
    },
    lieuDep: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    observation: {
      type: String,
      required: true,
    },
    etat: {
      type: Number,
      default: 1,
    },
    circonscriptionAdm: {
      type: String,
      required: true,
    }
  }, {
  timestamps: true
}
);
const Mission = mongoose.model("Mission", MissionSchema);
export default Mission;