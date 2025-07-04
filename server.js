import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mainRouter from "./src/routes/main.route.js"; // Nhớ thêm .js ở cuối
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => {
    res.send({ message: 'Welcome to Project' });
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", mainRouter);
connectDB();
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
