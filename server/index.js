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
import { createNotification } from "./controllers/Notification.js";
import { createOrUpdateFDocument } from "./controllers/FilesKpis.js";
import { createMission } from "./controllers/mission.js";
import { emitDataSpec, generateCustomId } from "./controllers/utils.js";
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
      // console.log(connectedUsers);
      connectedClients.push(socket.id);
      // console.log(connectedClients);
      socket.on("login", async (user, token) => {
        socket.user = user;
        const userId = user._id;
        const existingUser = connectedUsers.find(
          (u) => u.userId === userId && u.token === token
        );
        if (!existingUser) {
          connectedUsers.push({ userId, socketIds: [socket.id], token }); // Store the user ID and socket IDs in the array
          console.log(`User ${userId} connected`);
        } else {
          console.log(`User ${userId} already connected`);
          if (!existingUser.socketIds.includes(socket.id)) {
            existingUser.socketIds.push(socket.id); // Add the new socket ID to the existing user's socket IDs if it doesn't already exist
          }
        }

        // console.log(connectedUsers);
      });

      socket.on("logout", async () => {
        if (socket.user) {
          const userId = socket.user._id;
          console.log(`User ${userId} logged out`);

          const indexToRemove = connectedUsers.findIndex(
            (u) =>
              u.userId.toString() === userId.toString() &&
              u.socketIds.includes(socket.id)
          );
          if (indexToRemove !== -1) {
            const { userId, token, socketIds } = connectedUsers[indexToRemove];
            await emitDataSpec("sessionExpired", userId, socketIds); // Emit the sessionExpired event
            connectedUsers.splice(indexToRemove, 1);
          }

          // console.log(connectedUsers);
        }
      });

      socket.on("updatedData", async (type) => {
        try {
          // console.log(type);
          io.emit("updatedData", type);
        } catch (error) {
          console.error(error);
        }
      });

      // socket.on("disconnect", () => {
      //   if (socket.user) {
      //     const userId = socket.user._id;
      //     console.log(`User ${userId} disconnected`);
      //     const disconnectedUser = connectedUsers.find((u) => u.userId === userId);
      //     if (disconnectedUser) {
      //       disconnectedUser.socketId = null; // Set the socket ID to null to mark it as disconnected
      //     }
      //   }
      // });
    });
  })
  .catch((error) => {
    console.error(`Failed to connect to MongoDB database: ${error.message}`);
  });
//it works fine , just whenn we restart the server we need to refresh all the browsers

cron.schedule("50 01 * * *", async () => {
  console.log("working in index.js");

  // Update missions with tDateDeb equal to current time
  const currentDate = moment().format("YYYY-MM-DD");
  const missionsEnCours = await Mission.find({
    tDateDeb: { $eq: currentDate },
    etat: "acceptée",
  });

  for (const mission of missionsEnCours) {
    const employeIds = mission.employes.map((employe) => employe._id);

    for (const employeId of employeIds) {
      await User.updateOne(
        { _id: employeId },
        { $set: { etat: "missionnaire" } }
      );
    }

    let old = mission;
    mission.etat = "en-cours";
    let saved = await mission.save();
    //____________________________________________________________________________________
    //update etat
    createOrUpdateFMission(saved, "update", old, "etat");
    //____________________________________________________________________________________
    console.log(saved.structure);
    for (const employeId of employeIds) {
      let customId = await generateCustomId(saved.structure, "rapportfms");
      console.log(customId);
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

    //______________________________________________________________
    await createNotification({
      users: [employeIds],
      message:
        "Votre rapport de fin de mission a été créé et doit être rempli dans les délais impartis. Merci de prendre les mesures nécessaires pour le compléter.",
      path: "",
      type: "RFM",
    });
    //__________________________________________________
  }

  //pour chaque mission je fais ca
  // Update missions with tDateDeb equal to current time and etat equal to en-attente
  const missionsEnAttente = await Mission.find({
    tDateDeb: { $lte: new Date() },
    etat: "en-attente",
  });

  for (const mission of missionsEnAttente) {
    const employeIds = mission.employes.map((employe) => employe._id);
    let old = mission;
    mission.etat = "refusée";
    let saved = await mission.save();
    //____________________________________________________________________________________
    //update etat de en-attente a refusé ... change it
    createOrUpdateFMission(saved, "update", old, "etat");
    //____________________________________________________________________________________
    await createNotification({
      users: [employeIds],
      message:
        "votre demande de mission a été automatiquement rejetée en raison d'une absence de réponse.",
      path: "",
      type: "mission",
    });
    //____________________________________________________________________________________
  }

  // Update missions with tDateRet equal to current time and etat equal to en-cours
  const missionsEnCours2 = await Mission.find({
    tDateRet: { $lt: currentDate },
    etat: "en-cours",
  });

  for (const mission of missionsEnCours2) {
    const employeIds = mission.employes.map((employe) => employe._id);
    let old = mission;
    mission.etat = "terminée";
    let saved = await mission.save();
    //____________________________________________________________________________________
    //update etat de en-attente a terminée ... change it
    createOrUpdateFMission(saved, "update", old, "etat");
    //____________________________________________________________________________________
    await createNotification({
      users: [employeIds],
      message:
        "Mission réussie ! Merci de nous envoyer votre rapport de fin de mission dûment rempli.",
      path: "",
      type: "RFM",
    });
    //____________________________________________________________________________________
  }

  // Update users associated with completed missions
  const missionsEnded = await Mission.find({
    etat: "terminée",
  });

  for (const mission of missionsEnded) {
    const employeIds = mission.employes.map((employe) => employe._id);

    for (const employeId of employeIds) {
      await User.updateOne(
        { _id: employeId },
        { $set: { etat: "non-missionnaire" } }
      );
    }
  }

  console.log("finished updating index js ");
  io.emit("cronDataChange");
});

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
cron.schedule("12 11 * * *", async () => {
  //creation auto des RFM + OM
  console.log("starting");
  //RFM
  const missionsEnCours = await Mission.find({
    etat: { $in: ["en-cours", "terminée"] },
  });

  for (const mission of missionsEnCours) {
    const employeIds = mission.employes.map((employe) => employe._id);

    for (const employeId of employeIds) {
      let customId = await generateCustomId(mission.structure, "rapportfms");
      const rfm = new RapportFM({
        uid: customId,
        idMission: toId(mission._id),
        idEmploye: toId(employeId),
      });

      const savedRFM = await rfm.save();
    }
  }
  console.log("finished rfm");

  //OM

  const missionsAccepted = await Mission.find({
    etat: { $in: ["acceptée", "en-cours", "terminée"] },
  });

  for (const mission of missionsAccepted) {
    const employeIds = mission.employes.map((employe) => employe._id);

    for (const employeId of employeIds) {
      let customId = await generateCustomId(mission.structure, "rapportfms");
      const om = new OrdreMission({
        uid: customId,
        mission: toId(mission._id),
        employe: toId(employeId),
      });

      const savedOm = await om.save();
    }
  }
  console.log("finished om");
  console.log("emmiting");
  io.emit("cronDataChange");
  console.log("finished emmiting");
});
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

const addMissionsData = async () => {
  //grab missions array from data file loop through it and insert each element into db using createMission function
  missions.map(async (mission) => {
    const {
      uid,
      objetMission,
      structure,
      type,
      budget,
      pays,
      employes,
      taches,
      tDateDeb,
      tDateRet,
      moyenTransport,
      moyenTransportRet,
      lieuDep,
      destination,
      observation,
      circonscriptionAdm,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
    } = mission;
    const query = {
      uid,
      objetMission,
      structure,
      type,
      budget,
      pays,
      employes,
      taches,
      tDateDeb,
      tDateRet,
      moyenTransport,
      moyenTransportRet,
      lieuDep,
      destination,
      observation,
      etat: "en-attente",
      circonscriptionAdm,
      createdAt,
      createdBy,
      updatedBy,
      updatedAt,
    };
    const miss = new Mission(query);
    const savedMission = await miss.save();

    createOrUpdateFMission(savedMission, "creation", null, "");
  });
};
