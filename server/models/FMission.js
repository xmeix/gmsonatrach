import mongoose from "mongoose";

const FMissionSchema = new mongoose.Schema(
  {
    etat: { type: String },
    structure: { type: String },
    type: { type: String }, //local-etranger
    country: { type: String }, //country destination
    departure: { type: String },
    destination: { type: String },

    mission_count: { type: Number, default: 0 }, //etat terminée , en cours , acceptée

    solved_ticket_count: { type: Number, default: 0 }, //etat terminée , en cours
    total_ticket_count: { type: Number, default: 0 }, //etat terminée , en cours

    done_tasks_count: { type: Number, default: 0 }, //etat terminée , en cours
    total_tasks_count: { type: Number, default: 0 }, //etat terminée , en cours

    employee_count: { type: Number, default: 0 }, //etat terminée , en cours , acceptée
    road_utilization_count: { type: Number, default: 0 }, // etat terminée  + acceptée
    airline_utilization_count: { type: Number, default: 0 }, // etat terminée + acceptée

    estimated_budget: { type: Number, default: 0 }, //seul etat terminée
    consumed_budget: { type: Number, default: 0 }, //seul etat terminée
    time_Estimated: { type: Number, default: 0 }, //seul etat terminée
    time_Spent: { type: Number, default: 0 }, //seul etat terminée
  },
  {
    timestamps: true,
  }
);
const FMission = mongoose.model("FMission", FMissionSchema);
export default FMission;
