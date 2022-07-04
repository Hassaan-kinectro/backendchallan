// const { findClass, createClass } = require("../../libs/services/Class");
const Class = require("../../model/class"); 


//Route to Add Class.

exports.addclass = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
 try {
   const { addClass, classFees } = req.body;
   console.log(req.body); 

    if (  
          !addClass ||
          !classFees
        ) 
          return reject({
            code: 402,
            message: "All input is required",
          });

   const Isduplicate = await Class.findOne({ className: addClass });

   if (Isduplicate) {
     return reject({
       code: 409,
       message: "Class Already Exist. Please Login",
     });
   }

   const result = await Class.create({
     className: addClass,
     fees: classFees,
   });
 
   if (result) {
    return resolve({
      code: 200,
      data: result,
      message: "Class Created Successfully!",
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

//Route to Get All Classes.

exports.getallclasses = (req) => {
    return new Promise(async (resolve, reject) => {
    (async ()=> {
        try {
          const result = await Class.find();
          if (result) {
            return resolve({
              code: 200,
              data: result,
              message: "All Previously Created Classes!",
            });
          }
        }
        catch (err) {
        console.log(err);
        return reject({
          code: 500,
          message: "Internal server code!",
        });
    }    
    })();
    });
};

