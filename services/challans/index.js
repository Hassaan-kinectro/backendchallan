const express = require("express");
const routes = require("./routes");

const serviceRouter = express.Router();

serviceRouter.post("/generatechallan", routes.generatechallanRoute);
serviceRouter.get("/displaychallan", routes.displaychallanRoute);
serviceRouter.post("/updatestatus", routes.updatestatusRoute);
serviceRouter.get("/displayupdatedchallan", routes.displayupdatedchallanRoute);
module.exports = serviceRouter;
