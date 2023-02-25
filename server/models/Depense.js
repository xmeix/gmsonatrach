import mongoose from "mongoose";

const DepenseSchema = new mongoose.Schema(
  { 
    titre:{
      type:String,
      required:true, 
    },
    description:{
      type:String,
      required:true,
    },
    nbUnit:{
      type:Number,
      required:true,
    },
    prixUnit:{
      type:Number,
      required:true,
    }

  },{
    timestamps: true
   }
);
const Depense = mongoose.model("Depense",DepenseSchema);
export default Depense;