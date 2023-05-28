import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    mission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mission",
    },
    employe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    object: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    commentaires: [
      {
        contenu: {
          type: String,
          required: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    etat: {
      type: String,
      default: "unsolved",
      enum: ["solved", "unsolved"],
    },
  },
  {
    timestamps: true,
  }
);
const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
