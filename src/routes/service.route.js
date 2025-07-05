import express from "express";
import serviceController from "../controllers/service.controller.js";

const serviceRouter = express.Router();

serviceRouter.get("/", serviceController.getAllServices);
serviceRouter.get("/:name", serviceController.getServiceByName);
serviceRouter.post("/", serviceController.createService);

export default serviceRouter
