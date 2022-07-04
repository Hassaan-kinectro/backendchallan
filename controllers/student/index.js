const Student = require("../../model/student");

//Route to Add Student in the Class.

exports.addstudent = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {

        const { firstName, lastName, className, mode } = req.body;
        if (!firstName || !lastName || !className || !mode ) {
          return reject({
            code: 402,
            message: "All input is required",
          });
        }
        const result = await Student.create({
          firstName,
          lastName,
          className,
          mode,

        });
        if (result) {
          return resolve({
            code: 200,
            data: result,
            message: "Student added Successfully to the Class!",
          });
        } 
        
      } catch (err) {
        console.log(err);
        return reject({
          code: 500,
          message: "Internal server code!",
        });
      }
    })();
  });
};
