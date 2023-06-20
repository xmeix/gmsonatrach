import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import helmet from "helmet";
import moment from "moment";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import demandeRoutes from "./routes/demande.js";
import missionRoutes from "./routes/mission.js";
import ordreMissionRoutes from "./routes/ordreMission.js";
import rapportRoutes from "./routes/rapportFM.js";
import kpisRoutes from "./routes/kpis.js";
import notificationRoutes from "./routes/notification.js";
import ticketRoutes from "./routes/ticket.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import Mission from "./models/Mission.js";
import User from "./models/User.js";
import RapportFM from "./models/RapportFM.js";
import cron from "node-cron";
import jwt from "jsonwebtoken";
import { dbs } from "./data/dbs.js";
import { dcs } from "./data/dcs.js";
import { dms } from "./data/dms.js";
import { fdc } from "./data/fdc.js";
import { fdm } from "./data/fdm.js";
import { fdb } from "./data/fdb.js";
import { frfm } from "./data/frfm.js";
import { Fmissions } from "./data/fMissions.js";
import { missions } from "./data/missions.js";
// import { dbs } from "./data/dbData.js";
// import { dms } from "./data/dmData.js";
// import { missions } from "./data/missionData.js";
// import { missionsT } from "./data/missionDataTerm.js";
import { simpleData } from "./data/SimpleDataTerm.js";
// import { dcs } from "./data/dcData.js";
import { ticketData } from "./data/ticketData.js";
import { commentData } from "./data/ticketData.js";
import { createOrUpdateFMission } from "./controllers/Kpis.js";
import OrdreMission from "./models/OrdreMission.js";
import DM from "./models/demandes/DM.js";
import DB from "./models/demandes/DB.js";
import DC from "./models/demandes/DC.js";
import FDocument from "./models/FDocument.js";
import FMission from "./models/FMission.js";
import { verifyToken } from "./middleware/auth.js";
import {
  createNotification,
  emitNotification,
} from "./controllers/Notification.js";
import { createOrUpdateFDocument } from "./controllers/FilesKpis.js";
import { createMission } from "./controllers/mission.js";
import { emitGetData, generateCustomId } from "./controllers/utils.js";
import Ticket from "./models/Ticket.js";
import {
  sendDemEmits,
  sendRequestNotification,
} from "./controllers/demande.js";
import Demande from "./models/Demande.js";
const toId = mongoose.Types.ObjectId;
// Configure environment variables
dotenv.config();

// Create an instance of express
const app = express();

// Set up middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

// ____________________________________________________________________________
// Enable CORS for API calls
const corsOptions = {
  credentials: true,
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  methods: ["PATCH", "GET", "POST", "DELETE"],
};
app.use(cors(corsOptions));

// ____________________________________________________ ________________________
// Set up API routes
app.use("/auth", authRoutes);
app.use("/demande", demandeRoutes);
app.use("/mission", missionRoutes);
app.use("/ordremission", ordreMissionRoutes);
app.use("/rapportFM", rapportRoutes);
app.use("/kpis", kpisRoutes);
app.use("/notification", notificationRoutes);
app.use("/ticket", ticketRoutes);
// Set up the HTTP server and Socket.IO instance
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  },
});
export let connectedUsers = [];
export let connectedClients = [];
// ____________________________________________________________________________
// Connect to the MongoDB database
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database");

    // Start listening for HTTP requests
    server.listen(process.env.PORT || 6001, () => {
      console.log(`Server listening on port ${process.env.PORT || 6001}`);
    });
    //ADD DATA ONE TIME ONLY
    //await mongoose.connection.db.dropDatabase(); //ATTENTION DELETES THE WHOOOLE DB

    // Mission.insertMany(missions);
    // Ticket.insertMany(tickets);
    // FDocument.insertMany(fdm);
    // FDocument.insertMany(frfm);
    // FDocument.insertMany(fdb);
    // FDocument.insertMany(fdc);
    // FDocument.insertMany(fom);

    // DM.insertMany(dms);
    // DB.insertMany(dbs);
    // DC.insertMany(dcs);

    // FMission.insertMany(Fmissions);
    // addMissionsData();
    console.log("end");

    io.on("connection", (socket) => {
      console.log(connectedUsers);
      connectedClients.push(socket.id);
      // console.log(connectedClients);

      socket.on("login", async (user, token, tabId) => {
        socket.user = user;
        const userId = user._id;
        const existingUser = connectedUsers.find(
          (u) =>
            u.userId.toString() === userId.toString() &&
            u.token === token &&
            u.tabId === tabId
        );

        if (!existingUser) {
          //create new instance
          const newUser = {
            userId: userId,
            token: token,
            tabId: tabId,
            socketId: socket.id,
          };
          connectedUsers.push(newUser);
          console.log(`User ${userId} connected`);
          socket.emit("loginData", userId);
        } else {
          //update existing instance
          const idx = connectedUsers.findIndex(
            (u) =>
              u.userId.toString() === userId.toString() &&
              u.token === token &&
              u.tabId === tabId
          );
          //and replace the socketId with a newOne
          connectedUsers[idx].socketId = socket.id;
          console.log(`User ${userId} did connect already `);
        }
        // console.log(connectedUsers);
      });

      socket.on("logout", async (token) => {
        if (socket.user) {
          const userId = socket.user._id;
          console.log(`User ${userId} logged out`);

          const indexesToRemove = [];
          connectedUsers.forEach((u, index) => {
            if (
              u.userId.toString() === userId.toString() &&
              u.token === token
            ) {
              indexesToRemove.push(index);
            }
          });

          if (indexesToRemove.length > 0) {
            indexesToRemove.reverse().forEach((index) => {
              const removedUser = connectedUsers.splice(index, 1)[0];
              const socketId = removedUser.socketId;
              // Emit "Refresh" event to the specific socket ID
              io.to(socketId).emit("sessionExpired");
            });
          }

          // console.log(connectedUsers);
        }
      });

      // socket.on("updatedData", async (type) => {
      //   try {
      //     // console.log(type);
      //     io.emit("updatedData", type);
      //   } catch (error) {
      //     console.error(error);
      //   }
      // });
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB database: ${error.message}`);
  });

// CRON JOB POUR UNE APPLICATION TEMPS REEL
cron.schedule("20 14 * * *", async () => {
  console.log("Cron job starting...");

  //_____________________________________________________________________________________________________
  // IF MISSION DATE DEBUT = NOW() THEN UPDATE ITS STATE="EN-COURS", CREATE RFMS , UPDATE USERS STATUS
  //______________________________________________________________________________________________________

  const currentDate = moment().format("YYYY-MM-DD");
  // find les missions acceptée
  const missionsEnCours = await Mission.find({
    tDateDeb: { $eq: currentDate },
    etat: "acceptée",
  });

  // pour chacun des missions trouvé
  for (const mission of missionsEnCours) {
    const employeIds = mission.employes.map((employe) => employe._id);

    // for each employee change its state to missionnaire
    for (const employeId of employeIds) {
      await User.updateOne(
        { _id: employeId },
        { $set: { etat: "missionnaire" } }
      );
    }

    // emit getUsers for employeIds + responsables (meme structure)---------------------------------------
    emitDataCron(1, {
      others: mission.employes,
      structure: mission.structure,
    });
    let old = mission;
    // change the mission state to en cours
    mission.etat = "en-cours";
    let saved = await mission.save();

    // emit getMissions for employeIds + responsables (m structure)---------------------------------------
    emitDataCron(2, {
      others: mission.employes,
      structure: mission.structure,
    });

    //____________________________________________________________________________________
    // CASE FMISSION : update etat
    //____________________________________________________________________________________

    // createOrUpdateFMission(saved, "update", old, "etat");
    //____________________________________________________________________________________
    //update etat
    createOrUpdateFMission("update", {
      oldMission: old,
      newMission: saved,
      updateType: "etat",
    });
    //____________________________________________________________________________________

    // console.log(saved.structure);
    // for each employee of employees we create RFMS
    for (const employeId of employeIds) {
      let customId = await generateCustomId(saved.structure, "rapportfms");

      const rfm = new RapportFM({
        uid: customId,
        idMission: toId(mission._id),
        idEmploye: toId(employeId),
      });

      const savedRFM = await rfm.save();
      //______________________________________________________________
      const populatedRFM = await RapportFM.findById(savedRFM._id)
        .populate("idMission")
        .populate("idEmploye");

      createOrUpdateFDocument(populatedRFM, "RFM", "creation");
      //______________________________________________________________
    }
    // emit getRFMS for employeIds + responsables m structure -------------------------------------
    emitDataCron(3, {
      others: mission.employes,
      structure: mission.structure,
    });

    createNotification({
      users: [...employeIds],
      message:
        "Votre rapport de fin de mission a été créé et doit être rempli dans les délais impartis. Merci de prendre les mesures nécessaires pour le compléter.",
      path: "/gestion-des-missions/rfms",
      type: "RFM",
    });
    // emitNotification({ others: mission.employes });
  }

  //_____________________________________________________________________________________________________
  // IF MISSION DATE DEBUT <= NOW() AND STILL EN ATTENTE THEN UPDATE ITS STATE="REFUSEE"
  //______________________________________________________________________________________________________
  const missionsEnAttente = await Mission.find({
    tDateDeb: { $lte: new Date() },
    etat: "en-attente",
  });
  // ______________
  //  UPDATE STATE
  // ______________
  for (const mission of missionsEnAttente) {
    let old = mission;
    mission.etat = "refusée";
    let saved = await mission.save();

    // createOrUpdateFMission(saved, "update", old, "etat");
    //____________________________________________________________________________________
    //update etat
    createOrUpdateFMission("update", {
      oldMission: old,
      newMission: saved,
      updateType: "etat",
    });
    //____________________________________________________________________________________

    // __________________________________________________________________________
    //  CREATE NOTIFICATION FOR SECRETAIRE, DIRECTEUR, RESPONSABLE SAME STRUCTURE
    // __________________________________________________________________________
    let users = await User.find({
      $and: [
        {
          $or: [
            { role: "responsable", structure: mission.structure },
            { role: "directeur" },
            { role: "secretaire" },
          ],
        },
        { _id: { $ne: toId(mission.createdBy.id) } },
      ],
    });

    createNotification({
      users: [mission.createdBy, ...users],
      message: `la demande de mission prévu pour ${new Date(mission.tDateDeb)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-")} a ${new Date(mission.tDateRet)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(
          /\//g,
          "-"
        )} a été automatiquement rejetée en raison d'une absence de réponse.`,
      path: "",
      type: "mission",
    });
    // emitNotification({ others: [...users, mission.createdBy] });

    let responsables = users
      .filter((u) => u.role === "responsable")
      .map((u) => u);
    // emit getMissions responsables meme structure---------------------------------------
    emitDataCron(2, { others: responsables, structure: mission.structure });
  }

  //_____________________________________________________________________________________________________
  // IF MISSION DATE FIN < NOW() AND EN-COURS THEN UPDATE ITS STATE="TERMINEE"
  //______________________________________________________________________________________________________
  const missionsEnCours2 = await Mission.find({
    tDateRet: { $lt: currentDate },
    etat: "en-cours",
  });

  for (const mission of missionsEnCours2) {
    const employeIds = mission.employes.map((employe) => employe._id);
    let old = mission;
    // ______________
    //  UPDATE STATE
    // ______________
    mission.etat = "terminée";
    let saved = await mission.save();

    for (const employeId of employeIds) {
      await User.updateOne(
        { _id: employeId },
        { $set: { etat: "non-missionnaire" } }
      );
    }
    // emit getMissions to Employés + responsables same structure--------------------------------------

    // createOrUpdateFMission(saved, "update", old, "etat");
    //____________________________________________________________________________________
    //update etat
    createOrUpdateFMission("update", {
      oldMission: old,
      newMission: saved,
      updateType: "etat",
    });
    //____________________________________________________________________________________

    // __________________________________
    //  SEND REMINDER FOR EACH EMPLOYES
    // __________________________________
    createNotification({
      users: [employeIds],
      message:
        "Mission réussie ! Merci de nous envoyer votre rapport de fin de mission dûment rempli.",
      path: "/gestion-des-mission/rfms",
      type: "RFM",
    });

    // emitNotification({ others: mission.employes });
  }

  // emit getMissions + getUsers + getRFMS for secretaire , directeurs--------------XXXXXXX------------------
  let all = await User.find({
    $or: [{ role: "directeur" }, { role: "secretaire" }],
  })
    .select("_id")
    .lean();

  emitDataCron(4, { others: all.map((u) => u._id) });
  console.log("Cron job ending...");
});

// ____________________________________________________________________________________________
//  cron to add DB to db
// // ____________________________________________________________________________________________
// cron.schedule("37 18 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting db");
//   try {
//     for (const db of dbs) {
//       const {
//         motif,
//         idEmetteur,
//         idDestinataire,
//         numSC,
//         designationSC,
//         montantEngage,
//         nature,
//         motifDep,
//         observation,
//         dateDepart,
//         dateRetour,
//         depart,
//         destination,
//         paysDestination,
//         direction,
//         sousSection,
//         division,
//         base,
//         gisement,
//         employes,
//         createdAt,
//         etat,
//       } = db;

//       let emetteur = toId(idEmetteur);
//       let destinataire = toId(idDestinataire);
//       const customId = await generateCustomId("RELEX", "demandes");
//       const newDemande = new DB({
//         uid: customId,
//         __t: "DB",
//         motif,
//         idEmetteur: emetteur,
//         idDestinataire: destinataire,
//         numSC, // def ""
//         designationSC, // def ""
//         montantEngage, //def 0
//         nature,
//         motifDep,
//         observation,
//         dateDepart,
//         dateRetour,
//         depart,
//         destination,
//         paysDestination,
//         direction,
//         sousSection,
//         division,
//         base,
//         gisement,
//         employes,
//         createdAt,
//         etat,
//       });
//       const savedDemande = await newDemande.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end db");
// });

// ____________________________________________________________________________________________
//  cron to add DC to db
// ____________________________________________________________________________________________
// cron.schedule("35 18 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting dc");
//   try {
//     for (const dc of dcs) {
//       const {
//         motif,
//         DateDepart,
//         DateRetour,
//         LieuSejour,
//         Nature,
//         createdAt,
//         etat,
//       } = dc;

//       let responsable = await User.find({
//         $or: [{ role: "responsable" }],
//       });
//       const randomIndex = Math.floor(Math.random() * responsable.length);
//       const randomUser = responsable[randomIndex];
//       let destinataire = randomUser._id;

//       let employe = await User.find({
//         $and: [
//           {
//             $or: [
//               { role: "responsable", structure: randomUser.structure },
//               { role: "employe" },
//             ],
//           },
//         ],
//       });

//       const Index = Math.floor(Math.random() * employe.length);
//       const randUser = employe[Index];
//       let emetteur = randUser._id;

//       const customId = await generateCustomId(randomUser.structure, "demandes");
//       let newDemande = new DC({
//         uid: customId,
//         __t: "DC",
//         motif,
//         DateDepart,
//         DateRetour,
//         LieuSejour,
//         Nature,
//         idEmetteur: emetteur,
//         idDestinataire: destinataire,
//         createdAt: createdAt,
//         etat,
//       });

//       const savedDemande = await newDemande.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end dc");
// });

// ____________________________________________________________________________________________
//  cron to add DM to db
// ____________________________________________________________________________________________
// cron.schedule("33 18 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting dm");
//   try {
//     for (const dm of dms) {
//       const { motif, idemetteur, iddestinataire, createdAt, etat } = dm;

//       let employe = await User.findById(idemetteur);
//       let emetteur = employe._id;

//       let responsable = await User.find({
//         $and: [
//           {
//             $or: [{ role: "responsable", structure: employe.structure }],
//           },
//         ],
//       });
//       const randomIndex = Math.floor(Math.random() * responsable.length);
//       const randomUser = responsable[randomIndex];
//       let destinataire = randomUser._id;
//       const customId = await generateCustomId(
//         responsable.structure,
//         "demandes"
//       );
//       const newDemande = new DM({
//         uid: customId,
//         __t: "DM",
//         motif,
//         idEmetteur: emetteur,
//         idDestinataire: destinataire,
//         etat,
//         createdAt,
//       });
//       const savedDemande = await newDemande.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end dm");
// });

// function used to emit data to connected Users.
const emitDataCron = async (operation, ids) => {
  let { others, structure } = ids;
  console.log("others  ==> ", others);
  console.log("operation  ==> ", operation);
  let users = await User.find({
    $or: [{ role: "responsable", structure: structure }],
  })
    .select("_id")
    .lean();
  let allUsers = [];
  let otherUsers = [];
  let combinedUsers = [];

  allUsers = users.map((u) => u._id.toString());
  otherUsers = others.map((u) => u.toString());
  combinedUsers = otherUsers.concat(allUsers);
  console.log(combinedUsers);
  switch (operation) {
    case 1:
      emitGetData(combinedUsers, "getUsers");
      break;
    case 2:
      emitGetData(combinedUsers, "getMissions");
      break;
    case 3:
      emitGetData(combinedUsers, "getRfms");
      break;
    case 4:
      combinedUsers = others.map((u) => u.toString());
      emitGetData(combinedUsers, "getUsers");
      emitGetData(combinedUsers, "getMissions");
      emitGetData(combinedUsers, "getRfms");

      break;

    default:
      break;
  }
};

// ____________________________________________________________________________________________
//  cron to add Missions to db
// // ____________________________________________________________________________________________
// cron.schedule("32 16 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting missions");
//   try {
//     for (const mission of missions) {
//       const {
//         objetMission,
//         structure,
//         type,
//         budget,
//         budgetConsome,
//         oldDuree,
//         pays,
//         taches,
//         tDateDeb,
//         tDateRet,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep,
//         destination,
//         observation,
//         createdAt,
//         updatedAt,
//         employes,
//       } = mission;

//       const newEmployes = employes.map((employe) => toId(employe));
//       let creators = await User.find({
//         $and: [
//           {
//             $or: [
//               { role: "responsable", structure: structure },
//               { role: "directeur" },
//               { role: "secretaire" },
//             ],
//           },
//         ],
//       });

//       const randomIndex = Math.floor(Math.random() * creators.length);
//       const randomUser = creators[randomIndex];
//       let createdBy = randomUser._id;
//       let updatedBy = randomUser._id;

//       let newId = await generateCustomId(structure, "missions");
//       let etat;

//       if (
//         randomUser.role === "responsable" ||
//         randomUser.role === "directeur"
//       ) {
//         // Randomly select from "acceptée", "en cours", or "terminée"
//         const etatOptions = ["acceptée", "en-cours", "terminée"];
//         etat = etatOptions[Math.floor(Math.random() * etatOptions.length)];
//       } else {
//         // Randomly select from "refusée", "acceptée", "en cours", or "terminée"
//         const etatOptions = ["refusée", "acceptée", "en-cours", "terminée"];
//         etat = etatOptions[Math.floor(Math.random() * etatOptions.length)];
//       }
//       const dateDeb = new Date(tDateDeb);
//       const dateRet = new Date(tDateRet);
//       const timeDifference = Math.abs(dateRet - dateDeb);
//       const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

//       const newMission = new Mission({
//         uid: newId,
//         objetMission,
//         structure,
//         type,
//         budget,
//         budgetConsome: etat === "terminée" ? budgetConsome : 0,
//         oldDuree: etat === "terminée" ? oldDuree : daysDifference,
//         pays,
//         employes: newEmployes,
//         taches: taches ? taches : [],
//         tDateDeb: new Date(tDateDeb).toISOString(),
//         tDateRet: new Date(tDateRet).toISOString(),
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep: lieuDep ? lieuDep : "Alger",
//         destination,
//         observation,
//         etat: etat,
//         // circonscriptionAdm,
//         createdBy,
//         updatedBy,
//         createdAt,
//         updatedAt,
//       });
//       const savedMission = await newMission.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end missions");
// });
// ____________________________________________________________________________________________
//  cron to add Simple Missions Terminées to db
// // ____________________________________________________________________________________________
// cron.schedule("42 16 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting simple missions for AI");
//   try {
//     for (const mission of simpleData) {
//       const {
//         objetMission,
//         structure,
//         type,
//         budget,
//         budgetConsome,
//         pays,
//         taches,
//         tDateDeb,
//         tDateRet,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep,
//         destination,
//         createdAt,
//         updatedAt,
//         oldDuree,
//         etat,
//         employes,
//       } = mission;

//       let newEmployes = employes.map((emp) => toId(emp));

//       let creators = await User.find({
//         $and: [
//           {
//             $or: [
//               { role: "responsable", structure: structure },
//               { role: "directeur" },
//               { role: "secretaire" },
//             ],
//           },
//         ],
//       });

//       const randomIndex = Math.floor(Math.random() * creators.length);
//       const randomUser = creators[randomIndex];
//       let createdBy = randomUser._id;
//       let updatedBy = randomUser._id;

//       let newId = await generateCustomId(structure, "missions");

//       const newMission = new Mission({
//         uid: newId,
//         objetMission,
//         structure,
//         type,
//         budget,
//         budgetConsome,
//         pays,
//         employes: newEmployes,
//         taches: taches ? taches : [],
//         tDateDeb: new Date(tDateDeb).toISOString(),
//         tDateRet: new Date(tDateRet).toISOString(),
//         oldDuree,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep: lieuDep ? lieuDep : "Alger",
//         destination,
//         etat: etat,
//         createdBy,
//         updatedBy,
//         createdAt,
//         updatedAt,
//       });
//       const savedMission = await newMission.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end simple missions");
// });
// ____________________________________________________________________________________________
//  cron creation RFM+OM (FOR TESTING ONLY)
// ____________________________________________________________________________________________

// cron.schedule("24 17 * * *", async () => {
//   // Creation auto des RFM + OM
//   console.log("starting");

//   try {
//     // RFM
//     const missionsEnCours = await Mission.find({
//       etat: { $in: ["en-cours", "terminée"] },
//     }).limit(100);

//     for (const mission of missionsEnCours) {
//       console.log("1");
//       const employeIds = mission.employes.map((employe) => employe._id);

//       for (const employeId of employeIds) {
//         let customId = await generateCustomId(mission.structure, "rapportfms");
//         const deroulement = [];

//         const firstDate = new Date(mission.tDateDeb); // Get the start date of the mission
//         const lastDate = new Date(mission.tDateRet); // Get the end date of the mission

//         // Generate random values for each element in the deroulement array
//         let currentDate = new Date(firstDate); // Start with the first date

//         while (currentDate <= lastDate) {
//           const randomHebergement =
//             Math.random() < 0.5
//               ? "avec-prise-en-charge"
//               : "sans-prise-en-charge";
//           const randomDejeuner =
//             Math.random() < 0.5
//               ? "avec-prise-en-charge"
//               : "sans-prise-en-charge";
//           const randomDiner =
//             Math.random() < 0.5
//               ? "avec-prise-en-charge"
//               : "sans-prise-en-charge";
//           const randomObservation = ""; // You can customize the generation of random observations if needed

//           const deroulementItem = {
//             IdDate: currentDate,
//             hebergement: randomHebergement,
//             dejeuner: randomDejeuner,
//             diner: randomDiner,
//             observation: randomObservation,
//           };

//           deroulement.push(deroulementItem);

//           // Move to the next date
//           currentDate.setDate(currentDate.getDate() + 1);
//         }

//         const rfm = new RapportFM({
//           uid: customId,
//           idMission: mission._id,
//           idEmploye: employeId,
//           deroulement: deroulement,
//           etat:
//             mission.etat === "terminée" && Math.random() < 0.5
//               ? "créé"
//               : "accepté",
//         });

//         const savedRFM = await rfm.save();
//       }
//     }

//     console.log("finished rfm");

//     // OM

//     const missionsAccepted = await Mission.find({
//       etat: { $in: ["acceptée", "en-cours", "terminée"] },
//     }).limit(100);

//     for (const mission of missionsAccepted) {
//       const employeIds = mission.employes.map((employe) => employe._id);

//       for (const employeId of employeIds) {
//         let customId = await generateCustomId(mission.structure, "rapportfms");
//         const om = new OrdreMission({
//           uid: customId,
//           mission: mission._id,
//           employe: employeId,
//         });

//         const savedOm = await om.save();
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }

//   console.log("finished om");
// });
// ____________________________________________________________________________________________
//  cron to add Missions Tickets to db
// ____________________________________________________________________________________________
// cron.schedule("28 18 * * *", async () => {
//   console.log("start");
//   console.log("starting tickets");
//   try {
//     const missions = await Mission.find({ etat: "terminée" });

//     for (const mission of missions) {
//       const employeIds = mission.employes.map((employe) => employe);
//       const numTickets = Math.floor(Math.random() * 5) + 1; // Random number of tickets (1-5)

//       for (let i = 0; i < numTickets; i++) {
//         const randomEmployeeId =
//           employeIds[Math.floor(Math.random() * employeIds.length)];
//         const ticketIndex = Math.floor(Math.random() * ticketData.length);
//         const ticket = new Ticket({
//           mission: mission._id,
//           employe: randomEmployeeId,
//           object: ticketData[ticketIndex].object,
//           description: ticketData[ticketIndex].description,
//           isSolved:  Math.random() < 0.5 ? true : false

//         });

//         const numComments = Math.floor(Math.random() * employeIds.length) + 1; // Random number of comments (1 to employeIds.length)

//         for (let j = 0; j < numComments; j++) {
//           const randomEmployeeId =
//             employeIds[Math.floor(Math.random() * employeIds.length)];
//           const commentIndex = Math.floor(Math.random() * commentData.length);
//           const commentD = {
//             contenu: commentData[commentIndex].contenu,
//             createdBy: randomEmployeeId,
//           };

//           ticket.commentaires.push(commentD);
//         }

//         await ticket.save();
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end tickets");
// });
