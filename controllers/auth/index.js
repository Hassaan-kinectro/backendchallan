const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findUser, createUser } = require("../../libs/services/User");
const { id } = require("date-fns/locale");

//Route for Register

exports.register = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {
        console.log(req.body);
        // Get user input
        const { firstname, lastname, email, password, confirmpassword } =
          req.body;
        // Validate user input
        if (
          !email ||
          !password ||
          !firstname ||
          !lastname ||
          !confirmpassword
        ) 
        {
          return reject({
            code: 402,
            message: "All input is required",
          });
        }
        if (password != confirmpassword) {
          return reject({
            code: 400,
            message: "passwords must be same!",
          });
        }
        // check if user already exist

        // Validate if user exist in our database
        const oldUser = await findUser({ email });
        if (oldUser) {
          return reject({
            code: 409,
            message: "User Already Exist. Please Login",
          });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await createUser({
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
        return resolve({
          code: 200,
          data: user,
          message: "Register successfully!",
        });
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

//Route for Login.

exports.login = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {
        // Get user input
        const { email, password } = req.body;
     
        // Validate user input
        if (!email || !password) {
          {
            return reject({
              code: 402,
              message: "All input is required",
            });
          }
        }
        // Validate if user exist in our database
        const user = await findUser({ email });

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
          return resolve({
            code: 200,
            data: user,
            message: "login successfully!",
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
