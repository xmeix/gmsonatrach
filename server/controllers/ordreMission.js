import User from '../models/User.js';
import mongoose from 'mongoose';
import OrdreMission from '../models/OrdreMission.js';
const toId = mongoose.Types.ObjectId;

export const createOrdreMission = async (req, res) => {
    try {

        const { mission, employe } = req.body;

        const Mission = toId(mission);
        const Employe = toId(employe);

        const ordreMission = new OrdreMission({
            mission: Mission,
            employe: Employe
        });

        const savedOMission = await ordreMission.save();
        res.status(201).json({ savedOMission, msg: "Ordre Mission has been created successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getAllOrdresMissions = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const ordresMission = await OrdreMission.find();
        if (user.role === 4) res.status(500).json({ error: "Unauthorized" });
        else if (user.role === 1 || user.role === 2) res.status(200).json({ ordresMission });
        else if (user.role === 3) {
            //if error occured then change to user.id without toId
            const filteredOMissions = ordresMission.filter((om) => om.employe.toString() === toId(user.id).toString());
            res.status(200).json({ filteredOMissions });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}