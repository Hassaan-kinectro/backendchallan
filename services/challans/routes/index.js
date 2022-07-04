const { generatechallan, displaychallan, updatestatus, displayupdatedchallan } = require("../../../controllers/challan");

exports.generatechallanRoute = async (req, res) => {
  try {
    const resp = await generatechallan(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
};
exports.displaychallanRoute = async (req, res) => {
  try {
    const resp = await displaychallan(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
};
exports.updatestatusRoute = async (req, res) => {
  try {
    const resp = await updatestatus(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
};
exports.displayupdatedchallanRoute = async (req, res) => {
  try {
    const resp = await displayupdatedchallan(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
};
