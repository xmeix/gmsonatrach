import mongoose from "mongoose";

const OrdreMissionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    mission: {
      type: String,
      ref: "Mission",
    },
    employe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const OrdreMission = mongoose.model("OrdreMission", OrdreMissionSchema);
export default OrdreMission;
