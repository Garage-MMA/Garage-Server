const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/mongodb');
const mainRouter = require('./src/routes/mainRoutes'); 
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
