import express from "express";
import serviceController from "../controllers/service.controller.js";

const serviceRouter = express.Router();

serviceRouter.get("/", serviceController.getAllServices);

export default serviceRouter;

