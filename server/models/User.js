import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    prenom: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    fonction: {
      type: String,
      required: true,
    },
    numTel: {
      type: String,
      required: true,
      max: 10,
      validate: /^(0)(5|6|7)[0-9]{8}$/,
    },
    adresse: {
      type: String,
      required: true,
    },
    dateNaissance: {
      type: Date,
      required: true,
      min: "1923-01-01",
      max: "2123-01-01",
    },
    lieuNaissance: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 80,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    role: {
      type: Number,
      default: 3,
    },
    etat: {
      type: Number,
      default: 1,
    },
    taches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tache",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
