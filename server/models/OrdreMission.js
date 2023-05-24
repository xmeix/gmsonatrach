import mongoose from "mongoose";

const OrdreMissionSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    mission: {
      type: mongoose.Schema.Types.ObjectId,
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
