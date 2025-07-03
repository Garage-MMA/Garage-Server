const express = require('express');
const userRouter = require('./users.route');

const mainRouter = express.Router();
mainRouter.use('/users', userRouter);

module.exports = mainRouter;
