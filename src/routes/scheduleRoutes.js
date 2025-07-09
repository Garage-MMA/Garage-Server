import express from "express";
import {
    getScheduleByGarage,
    updateSchedulesSlot,

} from "../controllers/scheduleController.js";


const router = express.Router();

// 📌 Get schedule of a garage by date
router.get("/:garageId", getScheduleByGarage);

// 📌 Update slot of a garage
router.put("/update/:garageId", updateSchedulesSlot);



export default router;
