import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
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
    email: {
      type: String,
      required: true,
      unique: true,
      max: 80,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      //1-directeur 2-secretaire 3-employe 4-relex 5-sous-directeur
      type: String,
      enum: ["directeur", "secretaire", "employe", "relex", "responsable"],
      default: "employe",
    },
    etat: {
      //2-missionnaire/1-non missionnaire
      type: String,
      enum: ["non-missionnaire", "missionnaire"],
      default: "non-missionnaire",
    },
    structure: {
      type: String,
      default: "SECRETARIAT",
      enum: [
        "SECRETARIAT",
        "DG",
        "RELEX",
        "PMO",
        "FIN",
        "SD",
        "PRC",
        "HCM",
        "MRO",
        "IPM",
        "PDN",
        "TECH",
        "DATA",
        "CHANGE",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
