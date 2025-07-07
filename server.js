import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import mainRouter from "./src/routes/main.route.js";
import connectDB from "./src/config/mongodb.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  res.send({ message: 'Welcome to Project' });
});

app.use("/api", mainRouter);

connectDB();

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
