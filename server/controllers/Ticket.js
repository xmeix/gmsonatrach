import Ticket from "../models/Ticket.js";
import { emitGetData } from "./utils.js";

export const createTicket = async (req, res) => {
  try {
    const { mission, employe, object, description } = req.body;
    const ticket = new Ticket({ mission, employe, object, description });
    await ticket.save();

    EmitTicket({ others: mission.employes });
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
      .populate("mission.employes");

    // emitData("ticket");
    EmitTicket({ others: ticket.mission.employes });
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
    ).populate("mission.employes");

    EmitTicket({ others: ticket.mission.employes });

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeesBySolvedTickets = async (req, res) => {
  try {
    const employees = await Ticket.aggregate([
      {
        $group: {
          _id: "$employe",
          totalSolvedTickets: {
            $sum: { $cond: [{ $eq: ["$isSolved", true] }, 1, 0] },
          },
        },
      },
      { $sort: { totalSolvedTickets: 1 } },
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

    const sortedEmployees = employees.map(
      ({ employee, totalSolvedTickets }) => ({
        employee,
        totalSolvedTickets,
      })
    );

    console.log(sortedEmployees);

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
