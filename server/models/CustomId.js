import mongoose from "mongoose";

const CustomIdSchema = new mongoose.Schema({
  collectionName: {
    type: String,
    required: true,
  },
  structure: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const CustomId = mongoose.model("CustomId", CustomIdSchema);

export default CustomId;
