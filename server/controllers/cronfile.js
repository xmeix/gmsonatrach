
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
// cron.schedule("24 14 * * *", async () => {
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
// cron.schedule("19 14 * * *", async () => {
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
//         "creation",
//         createdAt
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
// cron.schedule("21 14 * * *", async () => {
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
// cron.schedule("28 11 * * *", async () => {
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
// cron.schedule("34 14 * * *", async () => {
//   console.log("start");
//   const toId = mongoose.Types.ObjectId;
//   console.log("starting missions");
//   try {
//     for (const mission of missionsT) {
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
//       } = mission;

//       let employes = await User.find({
//         $or: [{ role: "employe", structure: structure }],
//       });
//       const newEmployes = employes.map((employe) => employe._id);
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
//       console.log("creating oms+rfms");
//       const employeIds = newEmployes.map((employe) => employe._id);
//       for (const employeId of employeIds) {
//         let customId = await generateCustomId(structure, "ordremissions");
//         // console.log("creating om");
//         const om = new OrdreMission({
//           uid: customId,
//           mission: savedMission.id,
//           employe: employeId,
//           createdAt: createdAt,
//         });
//         const savedOm = await om.save();
//         //______________________________________________________________;
//         const populatedOM = await OrdreMission.findById(savedOm.id)
//           .populate("mission")
//           .populate("employe");
//         // ___________________________________________________________________________________________________
//         //                      CREATION FDOCUMENT
//         // ___________________________________________________________________________________________________
//         createOrUpdateFDocument(populatedOM, "OM", "creation", createdAt);
//         //______________________________________________________________;
//         // console.log("creating rfm");
//         let customId2 = await generateCustomId(structure, "rapportfms");
//         const rfm = new RapportFM({
//           uid: customId2,
//           idMission: savedMission.id,
//           idEmploye: employeId,
//           etat: Math.random() < 0.5 ? "créé" : "accepté",
//           createdAt: new Date(tDateDeb).toISOString(),
//         });

//         const savedRFM = await rfm.save();
//         //______________________________________________________________
//         const populatedRFM = await RapportFM.findById(savedRFM.id)
//           .populate("idMission")
//           .populate("idEmploye");

//         createOrUpdateFDocument(
//           populatedRFM,
//           "RFM",
//           "creation",
//           new Date(tDateDeb).toISOString()
//         );
//         //______________________________________________________________
//       }
//       // console.log("Inserting Fmissions, 1");

//       const query = {
//         uid: newId,
//         objetMission: objetMission,
//         structure: structure,
//         type,
//         budget,
//         budgetConsome,
//         pays,
//         employes: newEmployes,
//         taches,
//         tDateDeb,
//         tDateRet,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep,
//         destination,
//         etat: "en-attente",
//         oldDuree,
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
//       // console.log("Inserting Fmissions, 2");

//       const query2 = {
//         _id: savedMission._id,
//         uid: newId,
//         objetMission: objetMission,
//         structure: structure,
//         type,
//         budget,
//         budgetConsome,
//         pays,
//         employes: newEmployes,
//         taches,
//         tDateDeb,
//         tDateRet,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep,
//         destination,
//         oldDuree,
//         etat: "acceptée",
//         createdBy,
//         updatedBy,
//         createdAt,
//         updatedAt,
//       };

//       await createOrUpdateFMission("update", {
//         oldMission: query,
//         newMission: query2,
//         updateType: "etat",
//         created: createdAt,
//       });
//       // console.log("Inserting Fmissions, 3");

//       const query3 = {
//         _id: savedMission._id,

//         uid: newId,
//         objetMission: objetMission,
//         structure: structure,
//         type,
//         budget,
//         budgetConsome,
//         pays,
//         employes: newEmployes,
//         taches,
//         tDateDeb,
//         tDateRet,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep,
//         destination,
//         oldDuree,
//         etat: "en-cours",
//         createdBy,
//         updatedBy,
//         createdAt,
//         updatedAt,
//       };
//       await createOrUpdateFMission("update", {
//         oldMission: query2,
//         newMission: query3,
//         updateType: "etat",
//         created: new Date(tDateDeb).toISOString(),
//       });
//       // console.log("Inserting Fmissions, 4");

//       const query4 = {
//         _id: savedMission._id,
//         uid: newId,
//         objetMission: objetMission,
//         structure: structure,
//         type,
//         budget,
//         budgetConsome,
//         pays,
//         employes: newEmployes,
//         taches,
//         tDateDeb,
//         tDateRet,
//         moyenTransport,
//         moyenTransportRet,
//         lieuDep,
//         destination,
//         oldDuree,
//         etat: "terminée",
//         createdBy,
//         updatedBy,
//         createdAt,
//         updatedAt,
//       };
//       await createOrUpdateFMission("update", {
//         oldMission: query3,
//         newMission: query4,
//         updateType: "etat",
//         created: new Date(tDateRet).toISOString(),
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   console.log("end missions");
// });
// ____________________________________________________________________________________________
//  cron to add Simple Missions Terminées to db
// // ____________________________________________________________________________________________
// cron.schedule("04 14 * * *", async () => {
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
//  cron to add Missions Tickets to db
// ____________________________________________________________________________________________
// cron.schedule("10 14 * * *", async () => {
//   console.log("start");
//   console.log("starting tickets");
//   try {
//     const missions = await Mission.find({ etat: "terminée" });

//     for (const mission of missions) {
//       const employeIds = mission.employes.map((employe) => employe._id);
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
