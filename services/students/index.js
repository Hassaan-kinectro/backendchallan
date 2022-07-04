const express = require("express");
const routes = require("./routes");

const serviceRouter = express.Router();

serviceRouter.post("/addstudent", routes.addStudentRoute);

module.exports = serviceRouter;
