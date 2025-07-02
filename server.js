const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const connectDb = require('./config/mongodb.js');
// const apiRouter = require("./src/routes/api.routes")
require('dotenv').config();
app.use(cors());

app.get('/', async(req, res)=>{
    try {
        res.send({message: 'Welcome to Project'});
    } catch (error) {
        res.send({error: error.message});
    }
});
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
// app.use("/api", apiRouter)
connectDb();
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));