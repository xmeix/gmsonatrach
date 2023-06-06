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
import depenseRoutes from "./routes/depense.js";
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
  dbs,
  dcs,
  dms,
  missions,
  tickets,
  users,
} from "../client/src/data/data.js";
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
app.use("/depense", depenseRoutes);
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
cron.schedule("20 01 * * *", async () => {
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

  console.log("1");
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

    createOrUpdateFMission(saved, "update", old, "etat");

    // console.log(saved.structure);
    // for each employee of employees we create RFMS
    for (const employeId of employeIds) {
      let customId = await generateCustomId(saved.structure, "rapportfms");
      // console.log(customId);
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
      path: "",
      type: "RFM",
    });
    // emitNotification({ others: mission.employes });

  }
  console.log("2");

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

    createOrUpdateFMission(saved, "update", old, "etat");
    console.log("3");

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
    console.log("4");


     createNotification({
      users: [mission.createdBy, ...users], //this is a mistake , normally we would sennd a notification to the one who created it
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

    console.log("5");


    let responsables = users
      .filter((u) => u.role === "responsable")
      .map((u) => u);
    // emit getMissions responsables meme structure---------------------------------------
    console.log("6");

    emitDataCron(2, { others: responsables, structure: mission.structure });
    console.log("7");
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

    createOrUpdateFMission(saved, "update", old, "etat");
    // __________________________________
    //  SEND REMINDER FOR EACH EMPLOYES
    // __________________________________
     createNotification({
      users: [employeIds],
      message:
        "Mission réussie ! Merci de nous envoyer votre rapport de fin de mission dûment rempli.",
      path: "",
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

  // io.emit("cronDataChange");
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
  console.log(combinedUsers)
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
//cron to add users to db
// cron.schedule("31 07 * * *", async () => {
//   console.log("start");

//   try {
//     for (const user of users) {
//       const { nom, prenom, fonction, numTel, email, role, etat, structure } =
//         user;
//       const salt = await bcrypt.genSalt();
//       const passwordHash = await bcrypt.hash(user.password, salt);

//       const newUser = new User({
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
//       console.log(newUser);
//       const savedUser = await newUser.save();
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end");
// });

// cron creation RFM+OM

// _______________________________________________________________________

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
// _______________________________________________________________________
//Creation FMission
// cron.schedule("21 21 * * *", async () => {
//   const missions = await Mission.find();

//   console.log("here");
//   for (const mission of missions) {
//     createOrUpdateFMission(mission);
//   }
//   console.log("here");
// });

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
