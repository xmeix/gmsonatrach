import mongoose from "mongoose";
import FMission from "../models/FMission.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { emitGetData } from "./utils.js";
const toId = mongoose.Types.ObjectId;

export const createOrUpdateFMission = async (operation, needs) => {
  //cas creation mission
  let {
    newMission, // the new state (etat)
    created,
  } = needs;

  switch (operation) {
    case "creation": // this case is called whenever we create a mission.
      // we look for the most recent document that has been created with the data (etat,structure,..) of the current new mission
      const mostRecent = await FMission.findOne({
        etat: "en-attente",
        structure: newMission.structure,
        type: newMission.type,
        country: newMission.pays,
        departure: newMission.lieuDep,
        destination: newMission.destination,
      }).sort({ createdAt: -1 });
      // duplicate the most recent to create a new one similar to it but the difference in the measures
      const newFMission = new FMission({
        etat: "en-attente",
        structure: newMission.structure,
        type: newMission.type,
        country: newMission.pays,
        departure: newMission.lieuDep,
        destination: newMission.destination,
        mission_count: mostRecent ? mostRecent.mission_count + 1 : 1, //if we found the most recent mission document then we just add one mission(creation one mission) , orelse if theres no old document we initialize it with one 1
        solved_ticket_count: 0,
        total_ticket_count: 0,
        done_tasks_count: 0,
        total_tasks_count: mostRecent
          ? mostRecent.total_tasks_count +
            (newMission.taches ? newMission.taches.length : 0)
          : newMission.taches
          ? newMission.taches.length
          : 0,
        employee_count: mostRecent
          ? mostRecent.employee_count + newMission.employes.length
          : newMission.employes.length,
        road_utilization_count: mostRecent
          ? mostRecent.road_utilization_count +
            calculateTransportUtilizationCount(newMission, "route")
          : calculateTransportUtilizationCount(newMission, "route"),
        airline_utilization_count: mostRecent
          ? mostRecent.airline_utilization_count +
            calculateTransportUtilizationCount(newMission, "avion")
          : calculateTransportUtilizationCount(newMission, "avion"),
        estimated_budget: mostRecent
          ? mostRecent.estimated_budget +
            (newMission.budget ? newMission.budget : 0)
          : newMission.budget
          ? newMission.budget
          : 0,
        consumed_budget: 0,
        time_Estimated: mostRecent
          ? mostRecent.time_Estimated +
            calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet)
          : calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet),
        time_Spent: mostRecent
          ? mostRecent.time_Spent +
            calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet)
          : calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet),
        createdAt: created ? created : new Date(),
      });

      await newFMission.save();
      break;
    case "update":
      let {
        updateType,
        oldMission, //contains the old state
      } = needs;
      // SINCE ITS UPDATE , means that we already created a document , so we need to look for the most recent one , and the older than recent one.
      // One case is different , some creations go directly to accepted state, doesnt pass through en attente
      // Find the old most recent document with same type, structure, and old etat
      const oldFMission = await FMission.findOne({
        etat: oldMission ? oldMission.etat : "en-attente",
        structure: oldMission.structure,
        type: oldMission.type,
        country: oldMission.pays,
        departure: oldMission.lieuDep,
        destination: oldMission.destination,
      }).sort({ createdAt: -1 });

      // Find the most recent document with same type, structure, and etat
      const recentFMission = await FMission.findOne({
        etat: newMission ? newMission.etat : "",
        structure: newMission.structure,
        type: newMission.type,
        country: newMission.pays,
        departure: newMission.lieuDep,
        destination: newMission.destination,
      }).sort({ createdAt: -1 });

      let solvedTicketCount = 0;
      let totalTicketCount = 0;
      if (oldFMission) {
        try {
          solvedTicketCount = await calculateSolvedTickets(newMission);
          totalTicketCount = await calculateTotalTickets(newMission);
        } catch (error) {
          console.error(error);
          // Handle the error...
          return;
        }
      }
      // console.log("old   mission =====>", solvedTicketCount);
      switch (updateType) {
        case "etat":
          // Duplicate the old state document and decrement whatever fields
          let oldUpdatedDocument = new FMission({
            etat: oldMission.etat,
            structure: oldMission.structure,
            type: oldMission.type,
            country: oldMission.pays,
            departure: oldMission.lieuDep,
            destination: oldMission.destination,

            mission_count: oldFMission ? oldFMission.mission_count - 1 : 0, //if we found the most recent mission document then we just add one mission(creation one mission) , orelse if theres no old document we initialize it with one 1
            solved_ticket_count: oldFMission
              ? oldFMission.solved_ticket_count - solvedTicketCount
              : 0,
            total_ticket_count: oldFMission
              ? oldFMission.total_ticket_count - totalTicketCount
              : 0,
            done_tasks_count: oldFMission
              ? oldFMission.done_tasks_count - calculateDoneTasks(newMission)
              : 0,
            total_tasks_count: oldFMission
              ? oldFMission.total_tasks_count - calculateTotalTasks(newMission)
              : 0,
            employee_count: oldFMission
              ? oldFMission.employee_count - newMission.employes.length
              : 0,
            road_utilization_count: oldFMission
              ? oldFMission.road_utilization_count -
                calculateTransportUtilizationCount(newMission, "route")
              : 0,
            airline_utilization_count: oldFMission
              ? oldFMission.airline_utilization_count -
                calculateTransportUtilizationCount(newMission, "avion")
              : 0,
            estimated_budget: oldFMission
              ? oldFMission.estimated_budget - newMission.budget
              : 0,
            consumed_budget: 0,
            time_Estimated: oldFMission
              ? oldFMission.time_Estimated -
                calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet)
              : 0,
            time_Spent: oldFMission
              ? oldFMission.time_Spent -
                calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet)
              : 0,
            createdAt: created ? created : new Date(),
          });
          await oldUpdatedDocument.save();

          let newUpdatedDocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,

            mission_count: recentFMission
              ? recentFMission.mission_count + 1
              : 1,
            solved_ticket_count: recentFMission
              ? recentFMission.solved_ticket_count + solvedTicketCount
              : solvedTicketCount,
            total_ticket_count: recentFMission
              ? recentFMission.total_ticket_count + totalTicketCount
              : totalTicketCount,
            done_tasks_count: recentFMission
              ? recentFMission.done_tasks_count + calculateDoneTasks(newMission)
              : calculateDoneTasks(newMission),
            total_tasks_count: recentFMission
              ? recentFMission.total_tasks_count +
                calculateTotalTasks(newMission)
              : calculateTotalTasks(newMission),
            employee_count: recentFMission
              ? recentFMission.employee_count + newMission.employes.length
              : newMission.employes.length,

            road_utilization_count: recentFMission
              ? recentFMission.road_utilization_count +
                calculateTransportUtilizationCount(newMission, "route")
              : calculateTransportUtilizationCount(newMission, "route"),

            airline_utilization_count: recentFMission
              ? recentFMission.airline_utilization_count +
                calculateTransportUtilizationCount(newMission, "avion")
              : calculateTransportUtilizationCount(newMission, "avion"),

            estimated_budget: recentFMission
              ? recentFMission.estimated_budget + newMission.budget
              : newMission.budget,
            consumed_budget: 0,
            time_Estimated: recentFMission
              ? recentFMission.time_Estimated +
                calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet)
              : calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet),
            time_Spent: recentFMission
              ? recentFMission.time_Spent +
                calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet)
              : calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet),
            createdAt: created ? created : new Date(),
          });
          await newUpdatedDocument.save();

          break;
        case "tache":
          const diff = calculateDifferenceAT(oldMission, newMission);
          let newDocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission ? recentFMission.mission_count : 1,
            solved_ticket_count: recentFMission.solved_ticket_count,
            total_ticket_count: recentFMission.total_ticket_count,
            done_tasks_count: recentFMission
              ? diff > 0
                ? recentFMission.done_tasks_count - 1
                : recentFMission.done_tasks_count + 1
              : diff > 0
              ? 0
              : 1,
            total_tasks_count: recentFMission.total_tasks_count, //this one stays the same
            employee_count: recentFMission.employee_count,
            road_utilization_count: recentFMission.road_utilization_count,
            airline_utilization_count: recentFMission.airline_utilization_count,
            estimated_budget: recentFMission.estimated_budget,
            consumed_budget: recentFMission.consumed_budget,
            time_Estimated: recentFMission.time_Estimated,
            time_Spent: recentFMission.time_Spent,
            createdAt: created ? created : new Date(),
          });
          await newDocument.save();
          break;
        case "ticket": //when we add a new ticket
          let newFTdocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission ? recentFMission?.mission_count : 1,
            solved_ticket_count: recentFMission?.solved_ticket_count,
            total_ticket_count: recentFMission?.total_ticket_count + 1,
            done_tasks_count: recentFMission?.done_tasks_count,
            total_tasks_count: recentFMission?.total_tasks_count, //this one stays the same
            employee_count: recentFMission?.employee_count,
            road_utilization_count: recentFMission?.road_utilization_count,
            airline_utilization_count:
              recentFMission?.airline_utilization_count,
            estimated_budget: recentFMission?.estimated_budget,
            consumed_budget: recentFMission?.consumed_budget,
            time_Estimated: recentFMission?.time_Estimated,
            time_Spent: recentFMission?.time_Spent,
            createdAt: created ? created : new Date(),
          });
          await newFTdocument.save();

          break;
        case "date":
          let newFDdocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission ? recentFMission.mission_count : 1,
            solved_ticket_count: recentFMission
              ? recentFMission.solved_ticket_count
              : 1,
            total_ticket_count: recentFMission
              ? recentFMission.total_ticket_count
              : 1,
            done_tasks_count: recentFMission
              ? recentFMission.done_tasks_count
              : 1,
            total_tasks_count: recentFMission
              ? recentFMission.total_tasks_count
              : 1, //this one stays the same
            employee_count: recentFMission ? recentFMission.employee_count : 1,
            road_utilization_count: recentFMission
              ? recentFMission.road_utilization_count
              : 1,
            airline_utilization_count: recentFMission
              ? recentFMission.airline_utilization_count
              : 1,
            estimated_budget: recentFMission
              ? recentFMission.estimated_budget
              : 1,
            consumed_budget: recentFMission
              ? recentFMission.consumed_budget
              : 1,
            time_Estimated: recentFMission ? recentFMission.time_Estimated : 1,
            time_Spent: recentFMission
              ? recentFMission.time_Spent
                ? recentFMission.time_Spent -
                  calculateTimeSpent(oldMission.tDateDeb, oldMission.tDateRet) +
                  calculateTimeSpent(newMission.tDateDeb, newMission.tDateRet)
                : 0
              : 0,
            createdAt: created ? created : new Date(),
          });
          await newFDdocument.save();
          break;
        case "solvedTicket": // when a ticket is solved
          let newFSTdocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission ? recentFMission.mission_count : 1,
            solved_ticket_count: recentFMission
              ? recentFMission.solved_ticket_count + 1
              : 1,
            total_ticket_count: recentFMission
              ? recentFMission.total_ticket_count
              : 1,
            done_tasks_count: recentFMission
              ? recentFMission.done_tasks_count
              : 1,
            total_tasks_count: recentFMission
              ? recentFMission.total_tasks_count
              : 1, //this one stays the same
            employee_count: recentFMission ? recentFMission.employee_count : 1,
            road_utilization_count: recentFMission
              ? recentFMission.road_utilization_count
              : 1,
            airline_utilization_count: recentFMission
              ? recentFMission.airline_utilization_count
              : 1,
            estimated_budget: recentFMission
              ? recentFMission.estimated_budget
              : 1,
            consumed_budget: recentFMission
              ? recentFMission.consumed_budget
              : 1,
            time_Estimated: recentFMission ? recentFMission.time_Estimated : 1,
            time_Spent: recentFMission ? recentFMission.time_Spent : 1,
            createdAt: created ? created : new Date(),
          });
          await newFSTdocument.save();
          break;
        case "budget": //in analytics we only take the etat==="terminée"
          let newFBdocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission.mission_count,
            solved_ticket_count: recentFMission.solved_ticket_count,
            total_ticket_count: recentFMission.total_ticket_count,
            done_tasks_count: recentFMission.done_tasks_count,
            total_tasks_count: recentFMission.total_tasks_count,
            employee_count: recentFMission.employee_count,
            road_utilization_count: recentFMission.road_utilization_count,
            airline_utilization_count: recentFMission.airline_utilization_count,
            estimated_budget: recentFMission.estimated_budget,
            consumed_budget: recentFMission.consumed_budget
              ? recentFMission.consumed_budget + newMission.budgetConsome
              : newMission.budgetConsome,
            time_Estimated: recentFMission.time_Estimated,
            time_Spent: recentFMission.time_Spent,
            createdAt: created ? created : new Date(),
          });
          await newFBdocument.save();
          break;
        case "employeCount": //in analytics we only take the etat==="terminée"
          let newFEdocument = new FMission({
            etat: newMission.etat,
            structure: newMission.structure,
            type: newMission.type,
            country: newMission.pays,
            departure: newMission.lieuDep,
            destination: newMission.destination,
            mission_count: recentFMission.mission_count,
            solved_ticket_count: recentFMission.solved_ticket_count,
            total_ticket_count: recentFMission.total_ticket_count,
            done_tasks_count: recentFMission.done_tasks_count,
            total_tasks_count: recentFMission.total_tasks_count,
            employee_count: recentFMission.employee_count - 1,
            road_utilization_count: recentFMission.road_utilization_count,
            airline_utilization_count: recentFMission.airline_utilization_count,
            estimated_budget: recentFMission.estimated_budget,
            consumed_budget: recentFMission.consumed_budget,
            time_Estimated: recentFMission.time_Estimated,
            time_Spent: recentFMission.time_Spent,
            createdAt: created ? created : new Date(),
          });
          await newFEdocument.save();
          break;

        default:
          break;
      }

    default:
      break;
  }

  emitMissionKPI();
};

// Calculate the number of accomplished tasks in a mission
const calculateDifferenceAT = (oldMission, newMission) => {
  const oldCompletedTasks = oldMission.taches
    ? oldMission.taches.filter((tache) => tache.state === "accomplie").length
    : 0;
  const newCompletedTasks = newMission.taches
    ? newMission.taches.filter((tache) => tache.state === "accomplie").length
    : 0;

  return oldCompletedTasks - newCompletedTasks;
};

const calculateDoneTasks = (mission) => {
  if (mission?.taches)
    return mission.taches.filter((tache) => tache.state === "accomplie").length;
  else return 0;
};
const calculateTotalTasks = (mission) => {
  if (mission?.taches) return mission.taches.length;
  else return 0;
};

const calculateSolvedTickets = async (mission) => {
  try {
    const solvedTickets = await Ticket.countDocuments({
      mission: mission,
      isSolved: true,
    });
    console.log("solvedTickets", solvedTickets);
    return solvedTickets;
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    throw error;
  }
};

const calculateTotalTickets = async (mission) => {
  try {
    const totalTickets = await Ticket.countDocuments({ mission: mission });
    console.log("totalTickets", totalTickets);
    return totalTickets;
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    throw error;
  }
};
const calculateTimeSpent = (debut, fin) => {
  const debutDate = new Date(debut);
  const finDate = new Date(fin);
  const diffTime = Math.abs(finDate - debutDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const calculateTransportUtilizationCount = (mission, type) => {
  const transportCount =
    (mission.moyenTransport
      ? mission.moyenTransport.filter((t) => t === type).length
      : 0) +
    (mission.moyenTransportRet
      ? mission.moyenTransportRet.filter((t) => t === type).length
      : 0);
  return transportCount;
};

export const getMissionKPIS = async (req, res) => {
  try {
    const missionKpis = await FMission.find();
    res.status(200).json(missionKpis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const emitMissionKPI = async () => {
  let users = await User.find({
    $or: [{ role: "responsable" }, { role: "directeur" }],
  })
    .select("_id")
    .lean();
  let allUsers = [];

  allUsers = users.map((u) => u._id.toString());

  emitGetData(allUsers, "getMissionKPIs");
};
