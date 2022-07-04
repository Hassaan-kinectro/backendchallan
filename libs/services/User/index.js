const User = require("../../../model/user");
exports.findUser = (obj) => {
  return new Promise((resolve) => {
    try {
      User.findOne(obj).exec(function (err, user) {
        if (err) {
          return resolve(null);
        }
        return resolve(user);
      });
    } catch (err) {
      return resolve(null);
    }
  });
};
exports.createUser = (obj) => {
  return new Promise((resolve) => {
    try {
      const user = new User(obj);
      user.save((err) => {
        if (err) {
          return resolve(null);
        }
        return resolve(user);
      });
    } catch (err) {
      return resolve(null);
    }
  });
};
