import mongoose from "mongoose";
import Ticket from "../models/Ticket.js";
import { emitData } from "./utils.js";

export const createTicket = async (req, res) => {
  try {
    const { mission, employe, object, description } = req.body;
    const ticket = new Ticket({ mission, employe, object, description });
    await ticket.save();
    emitData("ticket");
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
    ).populate("commentaires.createdBy");

    emitData("ticket");
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
    );

    emitData("ticket");
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
