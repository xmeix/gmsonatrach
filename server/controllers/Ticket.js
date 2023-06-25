import Ticket from "../models/Ticket.js";
import { createOrUpdateFMission } from "./Kpis.js";
import { emitGetData } from "./utils.js";

export const createTicket = async (req, res) => {
  try {
    const { mission, employe, object, description } = req.body;
    const ticket = new Ticket({ mission, employe, object, description });
    await ticket.save();
    await ticket.populate("mission.employes");

    // ------------------------------------------------------------------------------------------------------XXXXXXXXXXXXXXXXXXXXXXX
    createOrUpdateFMission("update", {
      oldMission: mission,
      newMission: mission, // add one ticket to the number of tickets in this mission
      updateType: "ticket",
    });
    // ------------------------------------------------------------------------------------------------------XXXXXXXXXXXXXXXXXXXXXXX

    EmitTicket({ others: [...mission.employes] }); //might emit getKpis as well

    // emitData("ticket");
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("employe")
      .populate("mission")
      .populate("commentaires.createdBy");

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { contenu, createdBy } = req.body;
    const comment = { contenu, createdBy, createdAt: Date.now() }; // Fixed the createdAt value
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { $push: { commentaires: comment } },
      { new: true }
    )
      .populate("commentaires.createdBy")
      .populate("mission");

    // emitData("ticket");
    EmitTicket({ others: [...ticket.mission.employes, createdBy] });
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { isSolved: true },
      { new: true }
    ).populate("mission");

    createOrUpdateFMission("update", {
      oldMission: ticket.mission,
      newMission: ticket.mission, // add one ticket to the number of tickets in this mission
      updateType: "solvedTicket",
    });
    EmitTicket({ others: [...ticket.mission.employes] });

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeesBySolvedTickets = async (req, res) => {
  try {
    const structure = req.user.structure;
    const role = req.user.role;
    let employees;

    if (role === "responsable") {
      employees = await Ticket.aggregate([
        {
          $group: {
            _id: "$employe",

            totalSolvedTickets: {
              $sum: { $cond: [{ $eq: ["$isSolved", true] }, 1, 0] },
            },
          },
        },
        { $sort: { totalSolvedTickets: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "employeeDetails",
          },
        },
        { $unwind: "$employeeDetails" },
        {
          $match: { "employeeDetails.structure": structure },
        },
        {
          $project: {
            employee: "$employeeDetails",
            totalSolvedTickets: 1,
            _id: 0,
          },
        },
      ]);
    } else {
      employees = await Ticket.aggregate([
        {
          $group: {
            _id: "$employe",
            totalSolvedTickets: {
              $sum: { $cond: [{ $eq: ["$isSolved", true] }, 1, 0] },
            },
          },
        },
        { $sort: { totalSolvedTickets: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "employeeDetails",
          },
        },
        { $unwind: "$employeeDetails" },
        {
          $project: {
            employee: "$employeeDetails",
            totalSolvedTickets: 1,
            _id: 0,
          },
        },
      ]);
    }

    const sortedEmployees = employees.map(
      ({ employee, totalSolvedTickets }) => ({
        ...employee,
        totalSolvedTickets,
      })
    );
    console.log(sortedEmployees.filter((e) => e.uid === "04100010"));

    // console.log(sortedEmployees);
    res.json(sortedEmployees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const EmitTicket = async (ids) => {
  let { others } = ids;
  let combinedUsers = others.map((u) => u._id.toString());
  emitGetData(combinedUsers, "ticket");
};
