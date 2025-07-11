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


const router = express.Router();

router.get("/all", getAllGarages);
// 📌 Get nearby garages based on user's location
router.get("/", getNearbyGarages);

// 📌 Create new garage
router.post("/", createGarage);

// 📌 Update garage info
router.put("/:id", updateGarage);

// 📌 Delete a garage
router.delete("/:id", deleteGarage);

router.get("/by-owner/:ownerId", getGarageByOwnerId);

router.get("/search", searchGaragesByName);

export default router;
