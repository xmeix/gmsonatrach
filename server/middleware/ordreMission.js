import mongoose from 'mongoose';
import Mission from '../models/Mission.js';
import User from '../models/User.js';
const toId = mongoose.Types.ObjectId;


export const checkMissionEmpExistence = async (req, res, next) => {
    try {

        const missions = await Mission.find();
        const employes = await User.find();

        const filteredMissions = missions.filter((m) => toId(m.id).toString() === toId(req.body.mission).toString());
        const filteredEmployees = employes.filter((emp) => toId(emp.id).toString() === toId(req.body.employe).toString());
         if (filteredEmployees.length === 0 || filteredMissions.length === 0) res.status(201).json({ error: "mission employee does not exist" });
        else next();

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}