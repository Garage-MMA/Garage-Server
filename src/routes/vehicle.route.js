import express from "express";
import vehicleController from "../controllers/vehicle.controller.js";

const vehicleRouter = express.Router();

vehicleRouter.get("/my-vehicles", vehicleController.getMyVehicles);
vehicleRouter.post("/add-vehicle", vehicleController.addVehicle);
vehicleRouter.put("/update-vehicle/:licensePlate", vehicleController.updateVehicle);
vehicleRouter.delete("/delete-vehicle/:licensePlate", vehicleController.deleteVehicle);

export default vehicleRouter;