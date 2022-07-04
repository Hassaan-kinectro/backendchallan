const express = require("express");
const routes = require("./routes");

const serviceRouter = express.Router();

serviceRouter.post("/addclass", routes.addClassRoute);
serviceRouter.get("/getallclasses", routes.getallclassesRoute)

module.exports = serviceRouter;

