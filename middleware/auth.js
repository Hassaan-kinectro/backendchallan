const jwt = require("jsonwebtoken");
const {httpStatusCode, message } = require("../constants")
const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(httpStatusCode.NOT_FOUND).json( {
      code: httpStatusCode.NOT_FOUND,
      message: message.TOKEN_NOT_EXIST,
    });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(httpStatusCode.UNAUTHORIZED).send({
      code: httpStatusCode.UNAUTHORIZED,
      message: message.INVALID_ACCESS_TOKEN
    });
  }
  return next();
};

module.exports = verifyToken;
