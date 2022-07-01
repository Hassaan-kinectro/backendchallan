require("dotenv").config();
require("./config/database").connect();
const cors = require("cors");
const express = require("express");
var bcrypt = require("bcryptjs");
var { expressjwt: jwt } = require("express-jwt");
var jwt = require("jsonwebtoken");
const Challan = require("./model/challan");
const Student = require("./model/student");
const Class = require("./model/class");
const app = express();
app.use(cors());
app.use(express.json());

const auth = require("./middleware/auth");

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

// importing user context
const User = require("./model/user");

// Register------------------------

app.post("/register", async (req, res) => {
  // Our register logic starts here
  console.log(req.body);
  try {
    // Get user input
    const { firstname, lastname, email, password, confirmpassword } = req.body;

    // Validate user input
    if (!email || !password || !firstname || !lastname || !confirmpassword) {
      return res.status(402).send("All input is required");
    }
    if (password != confirmpassword) {
      return res.status(400).send("passwords must be same!");
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;
    await user.save();
    // return new user
    // res.status(201).json(user);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

// Login----------------------------------

app.post("/login", async (req, res) => {
  // Our login logic starts here
  console.log(req.body);
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return res.status(402).send("All inputs are required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      //  const result =  await bcrypt.compare(password, user.password)
      // Create token
      // console.log(result);
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      // await user.save();
      // user
      return res.status(200).send(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our login logic ends here
});

// Logic goes here + routes will be configured here.

// const Class = require("./model/class");

// //posts method for creating a new student class

// app.post("/myclass", async (req, res) => {
//   try {
//     const { className, classFees } = req.body;
//     const result = await new myclass({
//       className: req.body.className,
//       classFees: req.body.classFees,
//     }).save();
//     console.log(result);
//     return res.status(200).send(result);
//   } catch (error) {
//     console.log(error);
//   }
// });
// const Student = require("./model/student");

// // register a student into a class

// app.post("/myclass/:myclassId/students", async (req, res) => {
//   // new student({
//   //   firstName: req.body.firstName,
//   //   lastName: req.body.lastName,
//   //   className: req.body.className,
//   //   mode: req.body.mode,
//   //   _classId: req.params.myclassId,
//   // })

//   //   .save()
//   //   .then((student) => res.send(student))
//   //   .catch((error) => console.log(error));
//   try {
//     console.log("rty");
//     const { firstName, lastName, className, mode, _classId } = req.body;
//     console.log(req.body);
//     const result = await new student({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       className: req.body.className,
//       mode: req.body.mode,
//       _classId: req.body.myclassId,
//     }).save();
//     console.log(result);
//     return res.status(200).send(result);
//   } catch (error) {
//     console.log(error);
//   }
// });

// // generate a challan form for student

// const challan = require("./model/challan");

// app.post("/myclass/:myclassId/challan", async (req, res) => {
//   // new challan({
//   //   className: req.body.className,
//   //   mode: req.body.mode,
//   //   classFees: req.body.classFees,
//   //   _classId: req.body.myclassId,
//   // })

//   //   .save()
//   //   .then((challan) => res.send(challan))
//   //   .catch((error) => console.log(error));
//     try {
//     const { className, classFees, mode, _classId } = req.body;
//     console.log(req.body);
//     const result = await new challan({
//       className: req.body.className,
//       classFees: req.body.classFees,
//       mode: req.body.mode,
//       _classId: req.body.myclassId,
//     }).save();
//     console.log(result);
//     return res.status(200).send(result);
//   } catch (error) {
//     console.log(error);
//   }
// });

// //read all classes

// app.get("/myclass", (req, res) => {
//   myclass
//     .find({})

//     .then((myclass) => res.send(myclass))

//     .catch((error) => console.log(error));
// });

// //get one student class

// app.get("/myclass/:myclassId", (req, res) => {
//   myclass
//     .findOne({ _id: req.body.myclassId })

//     .then((myclass) => res.send(myclass))

//     .catch((error) => console.log(error));
// });

// //get all students from this classId

// app.get("/myclass/:myclassId/students", (req, res) => {
//   student
//     .find({ _classId: req.body.myclassId })

//     .then((student) => res.send(student))

//     .catch((error) => console.log(error));
// });

// //get all challans from this classId

// app.get("/myclass/:myclassId/challan", (req, res) => {
//   challan
//     .find({ _classId: req.body.myclassId })

//     .then((challan) => res.send(challan))

//     .catch((error) => console.log(error));
// });

// app.post ("/getchallan ",async (req, res) => {
// try {

// const { className, classFees, mode } = req.body;
// console.log(req.body);
// const result = await new challan({
//       className: req.body.className,
//       classFees: req.body.classFees,
//       mode: req.body.mode,
//       _classId: req.body.myclassId,
//     }).save();
//     console.log(result);
//     return res.status(200).send(result);
//  } catch (error) {
//   res.send(error)
// }
// })

// //get one student

// app.get("/myclass/:myclassId/students/:studentId", (req, res) => {
//   student
//     .findOne({ _classId: req.params.myclassId, _id: req.params.studentId })

//     .then((onestudent) => res.send(onestudent))

//     .catch((error) => console.log(error));
// });

// // app.use((req, res, next) => {
// //   res.header("Access-Control-Allow-origin", "*");

// //   res.header(
// //     "Access-Control-Allow-Methods",
// //     "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE"
// //   );

// //   res.header(
// //     "Access-Control-Allow-Headers",
// //     "Origin",
// //     "X-Requested-With",
// //     "Content-Type",
// //     "Accept"
// //   );
// //   next();
// //});


// // app.post("/add-student", async (req, res) => {
// //   try {
// //     const { firstName, lastName, className, mode } = req.body;

// //     if (!firstName || !lastName || !className || !mode) {
// //       return res.status(409).send("Please provide all fields");
// //     }

// //     const result = await student.create({
// //       firstName,
// //       lastName,
// //       className,
// //       mode,
// //     });

// //     if (result) {
// //       res.send("Student has been added successfully");
// //     }
// //   } catch (e) {
// //     res.send(e);
// //   }
// // });


//ADDING STUDENT

app.post("/add-student", async (req, res) => {
  try {
    const { firstName, lastName, className, mode } = req.body;

    if (!firstName || !lastName || !className || !mode) {
      return res.status(409).send("Please provide all fields");
    }

    const result = await Student.create({
      firstName,
      lastName,
      className,
      mode
    });

    if (result) {
      res.send("Student has been added successfully");
    }
  } catch (e) {
    res.send(e);
  }
});
 //ADD class

 app.post("/add-class", async (req, res) => {
   try {
     const { addClass, classFees } = req.body;

     const Isduplicate = await Class.findOne({ className: addClass });

     if (Isduplicate) {
       return res.send({ error: "Class already exists" });
     }

     const result = await Class.create({
       className: addClass,
       fees: classFees,
     });

     if (result) {
       res.send("Class has been added successfully");
     }
   } catch (e) {
     res.send(e);
   }
 });
//get all classes

 app.get("/get-class-name", async (req, res) => {
   const data = await Class.find();
   res.send(data);
 });

 //Generate Challan

 app.post("/generate-challan", async (req, res) => {
   try {
     const { className } = req.body;

     const result = await Class.findOne({ className }).lean();
     const { fees } = result;
// console.log(result);   
     const students = await Student.find ({ className, mode: [2, 4, 1]  }).lean();
// console.log(students); 
     //Generating Issue Date
     const dateObj = new Date();
     let date = ("0" + dateObj.getDate()).slice(-2);
     let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
     let year = dateObj.getFullYear();
     const issueDate = year + "-" + month + "-" + date;

    //  console.log("Issue Date:", issueDate);
    //  console.log("Due Date", dueDate);
     let finalFees,finalIssueData, finalDueDate;

     students.forEach((element) => {
       let d = new Date();
       d.setDate(d.getDate() + 21 * element.mode);
       const dueDate = JSON.stringify(d).split("T")[0].slice(1);
       finalFees = element.mode * fees;
       finalIssueData = issueDate;
       finalDueDate = dueDate;
       
       const saveChallan = async () => {
         const newChallan = await Challan.create ({
           classFees: finalFees,
           issueDate: finalIssueData,
           dueDate: finalDueDate,
           challan: element._id
         });
       };
       saveChallan();
     });
      console.log(students);
     res.send(students);

   } catch (e) {
     console.log(e);
     res.send(e);
   }
 });

 app.get("/display-challan", async (req, res) => {
   const result = await Challan.find({}).populate("challan");
  //  console.log(result)
   res.send(result);
 });

module.exports = app;
