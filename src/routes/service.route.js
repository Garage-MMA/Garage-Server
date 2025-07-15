import express from "express";
import serviceController from "../controllers/service.controller.js";

const serviceRouter = express.Router({ mergeParams: true });

serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/search/:name", serviceController.getServiceByName);
serviceRouter.post("/", serviceController.createService);
serviceRouter.put("/:index", serviceController.updateService); // Change :id to :index
serviceRouter.delete("/:index", serviceController.deleteService); // Change :id to :index

export default serviceRouter;