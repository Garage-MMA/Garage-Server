import express from "express";
import {
    getAllGarages,
    getNearbyGarages,
    createGarage,
    updateGarage,
    deleteGarage,
    getGarageByOwnerId,
    searchGaragesByName
} from "../controllers/garageController.js";
import upload from '../middleware/uploadImage.js';


const router = express.Router();

router.get("/all", getAllGarages);
// 📌 Get nearby garages based on user's location
router.get("/", getNearbyGarages);

router.post("/", createGarage);

router.put("/:id", updateGarage);

router.delete("/:id", deleteGarage);

router.get("/by-owner/:ownerId", getGarageByOwnerId);

router.get("/search", searchGaragesByName);

export default router;
