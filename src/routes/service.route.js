import express from "express";
import serviceController from "../controllers/service.controller.js";

const serviceRouter = express.Router();

serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/:name", serviceController.getServiceByName);
serviceRouter.get("/:category", serviceController.getServicesByCategory);
serviceRouter.post("/", serviceController.createService);
serviceRouter.put("/:id", serviceController.updateService);
serviceRouter.delete("/:id", serviceController.deleteService);

export default serviceRouter
