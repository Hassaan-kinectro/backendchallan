const { addstudent } = require("../../../controllers/student");

exports.addStudentRoute = async (req, res) => {
  try {
    const resp = await addstudent(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
};


