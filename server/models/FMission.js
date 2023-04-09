import mongoose from "mongoose";

const FMissionSchema = new mongoose.Schema(
  {
    etat: { type: String },
    structure: { type: String },
    type: { type: String }, //local-etranger
    country: { type: String },
    departure: { type: String },
    destination: { type: String },
    mission_count: { type: Number, default: 0 },
    success_count: { type: Number, default: 0 }, //success count
    fail_count: { type: Number, default: 0 }, //success count
    employee_count: { type: Number, default: 0 },
    road_utilization_count: { type: Number, default: 0 },
    airline_utilization_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
const FMission = mongoose.model("FMission", FMissionSchema);
export default FMission;
