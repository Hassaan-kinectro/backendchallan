const { register, login } = require("../../../controllers/auth");

exports.registerRoute = async (req, res) => {
  try {
    const resp = await register(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
};
exports.loginRoute = async (req, res) => {
  try {
    const resp = await login(req);
    res.json(resp);
  } catch (err) {
    res.json(err);
  }
};

