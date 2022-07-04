const { addclass,getallclasses} = require("../../../controllers/class");

exports.addClassRoute = async (req, res) => {
  try {
    const resp = await addclass(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
}; 
exports.getallclassesRoute = async (req, res) => {
  try {
    const resp = await getallclasses(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
}; 


