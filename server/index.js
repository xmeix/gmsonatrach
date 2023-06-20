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
import {
  FDB,
  FDC,
  FDM,
  FOM,
  FRFM,
  Fmissions,
  tickets,
  users,
} from "../client/src/data/data.js";
import { dbs } from "./data/dbData.js";
import { dms } from "./data/dmData.js";
import { missions } from "./data/missionData.js";
import { missionsT } from "./data/missionDataTerm.js";
import { dcs } from "./data/dcData.js";
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
    // FDocument.insertMany(FDM);
    // FDocument.insertMany(FRFM);
    // FDocument.insertMany(FDB);
    // FDocument.insertMany(FDC);
    // FDocument.insertMany(FOM);

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
//  cron to add users to db
// ____________________________________________________________________________________________

// cron.schedule("25 19 * * *", async () => {
//   console.log("start");
//   try {
//     for (const user of users) {
//       const { nom, prenom, fonction, numTel, email, role, etat, structure } =
//         user;
//       const salt = await bcrypt.genSalt();
//       const passwordHash = await bcrypt.hash(user.password, salt);
//       let customId = await generateCustomId(structure, "users");
//        const newUser = new User({
//         uid: customId,
//         nom,
//         prenom,
//         fonction,
//         numTel,
//         email,
//         password: passwordHash,
//         role,
//         etat,
//         structure,
//       });
//       const savedUser = await newUser.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end");
// });
// ____________________________________________________________________________________________
//  cron to add DB to db
// ____________________________________________________________________________________________
// cron.schedule("45 23 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting db");
//   try {
//     for (const db of dbs) {
//       const {
//         motif,
//         idemetteur,
//         iddestinataire,
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
//       } = db;

//       let emetteur = toId(idemetteur);
//       let destinataire = toId(iddestinataire);
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
//       });
//       const savedDemande = await newDemande.save();
//       // sendDemEmits("create", {
//       //   others: [emetteur],
//       //   type: "DB",
//       //   structure: "",
//       // });
//       const populatedDemande = await Demande.findById(savedDemande.id)
//         .populate("idEmetteur")
//         .populate("idDestinataire");

//       sendRequestNotification("creation", {
//         demande: populatedDemande,
//       });

//       // ____________________________________________________________________________
//       //                               CREATION FDOCUMENT
//       // ____________________________________________________________________________
//       createOrUpdateFDocument(
//         populatedDemande,
//         populatedDemande.__t,
//         "creation",
//         createdAt
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end db");
// });
// ____________________________________________________________________________________________
//  cron to add DM to db
// ____________________________________________________________________________________________
// cron.schedule("58 23 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting dm");
//   try {
//     for (const dm of dms) {
//       const { motif, idemetteur, iddestinataire, createdAt } = dm;

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
//         createdAt,
//       });
//       const savedDemande = await newDemande.save();
//       // sendDemEmits("create", {
//       //   others: [emetteur],
//       //   type: "DM",
//       //   structure: responsable.structure,
//       // });
//       const populatedDemande = await Demande.findById(savedDemande.id)
//         .populate("idEmetteur")
//         .populate("idDestinataire");

//       sendRequestNotification("creation", {
//         demande: populatedDemande,
//       });
//       // ____________________________________________________________________________
//       //                               CREATION FDOCUMENT
//       // ____________________________________________________________________________
//       createOrUpdateFDocument(
//         populatedDemande,
//         populatedDemande.__t,
//         "creation", createdAt
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end dm");
// });
// ____________________________________________________________________________________________
//  cron to add DC to db
// ____________________________________________________________________________________________
// cron.schedule("12 00 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting dc");
//   try {
//     for (const dc of dcs) {
//       const { motif, DateDepart, DateRetour, LieuSejour, Nature, createdAt } =
//         dc;

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
//       });

//       sendDemEmits("create", {
//         others: [emetteur],
//         type: "DC",
//         structure: randomUser.structure,
//       });

//       const savedDemande = await newDemande.save();

//       const populatedDemande = await Demande.findById(savedDemande.id)
//         .populate("idEmetteur")
//         .populate("idDestinataire");

//       sendRequestNotification("creation", {
//         demande: populatedDemande,
//       });
//       // ____________________________________________________________________________
//       //                               CREATION FDOCUMENT
//       // ____________________________________________________________________________
//       createOrUpdateFDocument(
//         populatedDemande,
//         populatedDemande.__t,
//         "creation",
//         createdAt
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end dc");
// });
// ____________________________________________________________________________________________
//  cron to add Missions to db
// // ____________________________________________________________________________________________
// cron.schedule("49 05 * * *", async () => {
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
//       } = mission;

//       let employes = await User.find({
//         $or: [{ role: "employe", structure: structure }],
//       });
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
//       let etat =
//         randomUser.role === "responsable" || randomUser.role === "directeur"
//           ? "acceptée"
//           : "en-attente";
//       const newMission = new Mission({
//         uid: newId,
//         objetMission,
//         structure,
//         type,
//         budget,
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

//       if (etat === "acceptée" && newEmployes.length > 0) {
//         //on doit générer l'ordre de mission
//         const employeIds = newEmployes.map((employe) => employe._id);
//         for (const employeId of employeIds) {
//           let customId = await generateCustomId(structure, "ordremissions");
//           const om = new OrdreMission({
//             uid: customId,
//             mission: savedMission.id,
//             employe: employeId,
//           });
//           await om.save();
//           //______________________________________________________________;
//           const populatedOM = await OrdreMission.findById(om._id)
//             .populate("mission")
//             .populate("employe");
//           // ___________________________________________________________________________________________________
//           //                      CREATION FDOCUMENT
//           // ___________________________________________________________________________________________________
//           createOrUpdateFDocument(populatedOM, "OM", "creation", createdAt);
//           //______________________________________________________________;
//         }
//       }

//       const query = {
//         uid: newId,
//         objetMission: objetMission,
//         structure: structure,
//         type,
//         budget,
//         pays,
//         employes: newEmployes,
//         taches,
//         tDateDeb,
//         tDateRet,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep,
//         destination,
//         observation,
//         etat: "en-attente",
//         // circonscriptionAdm,
//         createdBy,
//         updatedBy,
//         createdAt,
//         updatedAt,
//       };
//       // ____________________________________________________________________________________;
//       // createOrUpdateFMission(query, "creation", null, "");
//       await createOrUpdateFMission("creation", {
//         newMission: query,
//         created: createdAt,
//       });

//       if (savedMission.etat === "acceptée") {
//         // createOrUpdateFMission(savedMission, "update", query, "etat"); //---------------------------------------------XXXXXXXX
//         await createOrUpdateFMission("update", {
//           oldMission: query,
//           newMission: savedMission,
//           updateType: "etat",
//           created: createdAt,
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end missions");
// });
// ____________________________________________________________________________________________
//  cron to add Missions Terminées to db
// ____________________________________________________________________________________________
cron.schedule("40 00 * * *", async () => {
  console.log("start");
  const toId = mongoose.Types.ObjectId;
  console.log("starting missions");
  try {
    for (const mission of missionsT) {
      const {
        objetMission,
        structure,
        type,
        budget,
        budgetConsome,
        pays,
        taches,
        tDateDeb,
        tDateRet,
        moyenTransport,
        moyenTransportRet,
        lieuDep,
        destination,
        observation,
        createdAt,
        updatedAt,
        oldDuree,
      } = mission;

      let employes = await User.find({
        $or: [{ role: "employe", structure: structure }],
      });
      const newEmployes = employes.map((employe) => toId(employe));
      let creators = await User.find({
        $and: [
          {
            $or: [
              { role: "responsable", structure: structure },
              { role: "directeur" },
              { role: "secretaire" },
            ],
          },
        ],
      });

      const randomIndex = Math.floor(Math.random() * creators.length);
      const randomUser = creators[randomIndex];
      let createdBy = randomUser._id;
      let updatedBy = randomUser._id;

      let newId = await generateCustomId(structure, "missions");

      const newMission = new Mission({
        uid: newId,
        objetMission,
        structure,
        type,
        budget,
        budgetConsome,
        pays,
        employes: newEmployes,
        taches: taches ? taches : [],
        tDateDeb: new Date(tDateDeb).toISOString(),
        tDateRet: new Date(tDateRet).toISOString(),
        oldDuree,
        moyenTransport,
        moyenTransportRet,
        lieuDep: lieuDep ? lieuDep : "Alger",
        destination,
        observation,
        etat: etat,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
      });
      const savedMission = await newMission.save();

      const employeIds = newEmployes.map((employe) => employe._id);
      for (const employeId of employeIds) {
        let customId = await generateCustomId(structure, "ordremissions");
        const om = new OrdreMission({
          uid: customId,
          mission: savedMission.id,
          employe: employeId,
          createdAt: createdAt,
        });
        await om.save();
        //______________________________________________________________;
        const populatedOM = await OrdreMission.findById(om._id)
          .populate("mission")
          .populate("employe");
        // ___________________________________________________________________________________________________
        //                      CREATION FDOCUMENT
        // ___________________________________________________________________________________________________
        createOrUpdateFDocument(populatedOM, "OM", "creation", createdAt);
        //______________________________________________________________;

        let customId2 = await generateCustomId(structure, "rapportfms");
        const rfm = new RapportFM({
          uid: customId2,
          idMission: savedMission.id,
          idEmploye: employeId,
          createdAt: new Date(tDateDeb).toISOString(),
        });

        const savedRFM = await rfm.save();
        //______________________________________________________________
        const populatedRFM = await RapportFM.findById(savedRFM._id)
          .populate("idMission")
          .populate("idEmploye");

        createOrUpdateFDocument(
          populatedRFM,
          "RFM",
          "creation",
          new Date(tDateDeb).toISOString()
        );
        //______________________________________________________________
      }

      const query = {
        uid: newId,
        objetMission: objetMission,
        structure: structure,
        type,
        budget,
        budgetConsome,
        pays,
        employes: newEmployes,
        taches,
        tDateDeb,
        tDateRet,
        moyenTransport,
        moyenTransportRet,
        lieuDep,
        destination,
        observation,
        etat: "en-attente",
        oldDuree,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
      };
      // ____________________________________________________________________________________;
      // createOrUpdateFMission(query, "creation", null, "");
      await createOrUpdateFMission("creation", {
        newMission: query,
        created: createdAt,
      });

      const query2 = {
        uid: newId,
        objetMission: objetMission,
        structure: structure,
        type,
        budget,
        budgetConsome,
        pays,
        employes: newEmployes,
        taches,
        tDateDeb,
        tDateRet,
        moyenTransport,
        moyenTransportRet,
        lieuDep,
        destination,
        observation,
        oldDuree,
        etat: "acceptée",
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
      };

      await createOrUpdateFMission("update", {
        oldMission: query,
        newMission: query2,
        updateType: "etat",
        created: createdAt,
      });
      const query3 = {
        uid: newId,
        objetMission: objetMission,
        structure: structure,
        type,
        budget,
        budgetConsome,
        pays,
        employes: newEmployes,
        taches,
        tDateDeb,
        tDateRet,
        moyenTransport,
        moyenTransportRet,
        lieuDep,
        destination,
        observation,
        oldDuree,
        etat: "en-cours",
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
      };
      await createOrUpdateFMission("update", {
        oldMission: query2,
        newMission: query3,
        updateType: "etat",
        created: new Date(tDateDeb).toISOString(),
      });
      const query4 = {
        uid: newId,
        objetMission: objetMission,
        structure: structure,
        type,
        budget,
        budgetConsome,
        pays,
        employes: newEmployes,
        taches,
        tDateDeb,
        tDateRet,
        moyenTransport,
        moyenTransportRet,
        lieuDep,
        destination,
        observation,
        oldDuree,
        etat: "terminée",
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
      };
      await createOrUpdateFMission("update", {
        oldMission: query3,
        newMission: query4,
        updateType: "etat",
        created: new Date(tDateRet).toISOString(),
      });
    }
  } catch (error) {
    console.log(error);
  }
  console.log("end missions");
});
// ____________________________________________________________________________________________
//  cron to add Missions Tickets to db
// ____________________________________________________________________________________________
cron.schedule("00 00 * * *", async () => {
  console.log("start");
  const toId = mongoose.Types.ObjectId;
  console.log("starting tickets");
  try {
    const ticketData = [
      { object: "Ticket Object 1", description: "Ticket Description 1" },
      { object: "Ticket Object 2", description: "Ticket Description 2" },
      { object: "Ticket Object 3", description: "Ticket Description 3" },
      // Add more ticket data as needed
    ];

    const commentData = [
      { contenu: "Comment 1" },
      { contenu: "Comment 2" },
      { contenu: "Comment 3" },
      // Add more comment data as needed
    ];
    const missions = await Mission.find({ etat: "terminée" });

    for (const mission of missions) {
      const employeIds = mission.employes.map((employe) => employe._id);
      const numTickets = Math.floor(Math.random() * 5) + 1; // Random number of tickets (1-5)

      for (let i = 0; i < numTickets; i++) {
        const randomEmployeeId =
          employeIds[Math.floor(Math.random() * employeIds.length)];
        const ticketIndex = Math.floor(Math.random() * ticketData.length);
        const ticket = new Ticket({
          mission: mission._id,
          employe: randomEmployeeId,
          object: ticketData[ticketIndex].object,
          description: ticketData[ticketIndex].description,
        });

        const numComments = Math.floor(Math.random() * employeIds.length) + 1; // Random number of comments (1 to employeIds.length)

        for (let j = 0; j < numComments; j++) {
          const randomEmployeeId =
            employeIds[Math.floor(Math.random() * employeIds.length)];
          const commentIndex = Math.floor(Math.random() * commentData.length);
          const commentData = {
            contenu: commentData[commentIndex].contenu,
            createdBy: randomEmployeeId,
          };

          ticket.commentaires.push(commentData);
        }

        await ticket.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log("end tickets");
});

// ____________________________________________________________________________________________
//  cron creation RFM+OM (FOR TESTING ONLY)
// ____________________________________________________________________________________________

// cron.schedule("12 11 * * *", async () => {
//   //creation auto des RFM + OM
//   console.log("starting");
//   //RFM
//   const missionsEnCours = await Mission.find({
//     etat: { $in: ["en-cours", "terminée"] },
//   });

//   for (const mission of missionsEnCours) {
//     const employeIds = mission.employes.map((employe) => employe._id);

//     for (const employeId of employeIds) {
//       let customId = await generateCustomId(mission.structure, "rapportfms");
//       const rfm = new RapportFM({
//         uid: customId,
//         idMission: toId(mission._id),
//         idEmploye: toId(employeId),
//       });

//       const savedRFM = await rfm.save();
//     }
//   }
//   console.log("finished rfm");

//   //OM

//   const missionsAccepted = await Mission.find({
//     etat: { $in: ["acceptée", "en-cours", "terminée"] },
//   });

//   for (const mission of missionsAccepted) {
//     const employeIds = mission.employes.map((employe) => employe._id);

//     for (const employeId of employeIds) {
//       let customId = await generateCustomId(mission.structure, "rapportfms");
//       const om = new OrdreMission({
//         uid: customId,
//         mission: toId(mission._id),
//         employe: toId(employeId),
//       });

//       const savedOm = await om.save();
//     }
//   }
//   console.log("finished om");
//   console.log("emmiting");
//   io.emit("cronDataChange");
//   console.log("finished emmiting");
// });

// ____________________________________________________________________________________________
//  cron creation FMission (FOR TESTING ONLY)
// ____________________________________________________________________________________________

// const addMissionsData = async () => {
//   //grab missions array from data file loop through it and insert each element into db using createMission function
//   missions.map(async (mission) => {
//     const {
//       uid,
//       objetMission,
//       structure,
//       type,
//       budget,
//       pays,
//       employes,
//       taches,
//       tDateDeb,
//       tDateRet,
//       moyenTransport,
//       moyenTransportRet,
//       lieuDep,
//       destination,
//       observation,
//       circonscriptionAdm,
//       createdBy,
//       updatedBy,
//       createdAt,
//       updatedAt,
//     } = mission;
//     const query = {
//       uid,
//       objetMission,
//       structure,
//       type,
//       budget,
//       pays,
//       employes,
//       taches,
//       tDateDeb,
//       tDateRet,
//       moyenTransport,
//       moyenTransportRet,
//       lieuDep,
//       destination,
//       observation,
//       etat: "en-attente",
//       circonscriptionAdm,
//       createdAt,
//       createdBy,
//       updatedBy,
//       updatedAt,
//     };
//     const miss = new Mission(query);
//     const savedMission = await miss.save();

//     createOrUpdateFMission(savedMission, "creation", null, "");
//   });
// };
