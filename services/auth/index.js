const express = require("express");
const routes = require("./routes");

const serviceRouter = express.Router();

serviceRouter.post("/register", routes.registerRoute);
serviceRouter.post("/login", routes.loginRoute);

module.exports = serviceRouter;
