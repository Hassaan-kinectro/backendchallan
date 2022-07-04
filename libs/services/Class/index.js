const Class  = require("../../../model/class")

exports.findClass = (obj) => {
  return new Promise((resolve) => {
    try {
      Class.findOne(obj).exec(function (err, Isduplicate) {
        if (err) { 
          return resolve(null);
        }
        return resolve(Isduplicate);
      });
    } catch (err) {
      return resolve(null);
    }
  });
};
exports.createClass = (obj) => {
  return new Promise((resolve) => {
    try {
      const result = new Class(obj);
      user.save((err) => {
        if (err) {
          return resolve(null);
        }
        return resolve(result);
      });
    } catch (err) {
      return resolve(null);
    }
  });
};