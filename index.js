require("dotenv").config();
require("./config/database").connect();
const cors = require("cors");
const express = require("express");
const bcrypt = require("bcryptjs");
const dateFns = require("date-fns");
const jwt = require("jsonwebtoken");
const Challan = require("./model/challan");
const Student = require("./model/student");
const Class = require("./model/class");
const User = require("./model/user");
const app = express();

const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const auth = require("./middleware/auth");

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

//healthCheck
app.get("/healthcheck", async (_req, res, _next) => {
  // optional: add further things to check (e.g. connecting to dababase)
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    res.status(503).send();
  }
});

app.use("/api", require("./router"));

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
    xvvxc;

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

//ADDING STUDENT

app.post("/add-student", async (req, res) => {
  try {
    const { firstName, lastName, className, mode, status } = req.body;

    if (!firstName || !lastName || !className || !mode || !status) {
      return res.status(409).send("Please provide all fields");
    }

    const result = await Student.create({
      firstName,
      lastName,
      className,
      mode,
      status,
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

    console.log(result);

    const students = await Student.find({ className, mode: [2, 4, 1] }).lean();
    // console.log(students);

    //Generating Issue Date

    const dateObj = new Date();
    let date = ("0" + dateObj.getDate()).slice(-2);
    let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    let year = dateObj.getFullYear();
    const issueDate = year + "-" + month + "-" + date;

    //  console.log("Issue Date:", issueDate);
    //  console.log("Due Date", dueDate);
    let finalFees, finalIssueData, finalDueDate;

    students.forEach((element) => {
      let d = new Date();
      d.setDate(d.getDate() + 21 * element.mode);
      const dueDate = JSON.stringify(d).split("T")[0].slice(1);
      finalFees = element.mode * fees;
      finalIssueData = issueDate;
      finalDueDate = dueDate;

      const saveChallan = async () => {
        const newChallan = await Challan.create({
          classFees: finalFees,
          issueDate: finalIssueData,
          dueDate: finalDueDate,
          challan: element._id,
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
  console.log(result);
  res.send(result);
});

// update status

app.post("/update-status", async (req, res) => {
  const { challanId, status } = req.body;
  console.log(req.body);
  const challan = await Challan.findOneAndUpdate(
    { _id: challanId },
    { status }
  );
  res.send(challan);
});

// //display updated challan

app.get("/display-updated-challans", async (req, res) => {
  const result = await Challan.find({}).populate("challan");
  console.log(result);
  res.send(result);
});
// server listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});