import mongoose from "mongoose";

const FMissionSchema = new mongoose.Schema(
  {
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    state: { type: String },
    day: { type: Date }, 
    structure: { type: String },
    type: { type: String },
    country: { type: String },
    destination: { type: String },
    success_rate: { type: Number },
    employee_count: { type: Number },
    accomplishedTask_count: { type: Number },
    nonAccomplishedTask_count: { type: Number },
    road_utilization_count: { type: Number },
    airline_utilization_count: { type: Number },
  },
  {
    timestamps: true,
  }
);
const FMission = mongoose.model("FMission", FMissionSchema);
export default FMission;
