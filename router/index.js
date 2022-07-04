const express = require("express");
const serviceRouter = express.Router();

serviceRouter.use("/auth", require("../services/auth"));
serviceRouter.use("/students", require("../services/students"));
serviceRouter.use("/classes", require("../services/classes"));
serviceRouter.use("/challans", require("../services/challans"));
module.exports = serviceRouter;
