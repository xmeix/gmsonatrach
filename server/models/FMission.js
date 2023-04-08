import mongoose from "mongoose";

const FMissionSchema = new mongoose.Schema(
  {
    etat: { type: String },
    structure: { type: String },
    type: { type: String }, //local-etranger
    country: { type: String },
    destination: { type: String },
    mission_count: { type: String },
    success_count: { type: Number, default: 0 }, //success count
    fail_count: { type: Number, default: 0 }, //success count
    employee_count: { type: Number },
    road_utilization_count: { type: Number },
    airline_utilization_count: { type: Number },
  },
  {
    timestamps: true,
  }
);
const FMission = mongoose.model("FMission", FMissionSchema);
export default FMission;
