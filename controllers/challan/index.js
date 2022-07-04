const Challan = require("../../model/challan");
const Student = require("../../model/student");
const Class = require("../../model/class");

//Route to  generate challans for student by their classnames

exports.generatechallan = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {
        const { className } = req.body;
        console.log(req.body);
        if (!className) {
          return reject({
            code: 402,
            message: "input is required",
          });
        }
        const result = await Class.findOne({ className }).lean();
        const { fees } = result;

        console.log(result);

        const students = await Student.find({
          className,
          mode: [2, 4, 1],
        }).lean();
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

        if (result) {
          return resolve({
            code: 200,
            data: students,
            message: "Challan generated Successfully!",
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

//Route to display all the challans generated lately

exports.displaychallan = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {
        const result = await Challan.find({}).populate("challan");
        console.log(result);
        if (result) {
          return resolve({
            code: 200,
            data: result,
            message: "All Generated Challans Displayed Successfully!",
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

//Route to update the status of selected challan

exports.updatestatus = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {
        const { challanId, status } = req.body;
        console.log(req.body);
        if (!challanId || !status) {
          return reject({
            code: 402,
            message: "Inputs are required",
          });
        }
        const result = await Challan.findOneAndUpdate(
          { _id: challanId },
          { status },
          { new: true }
        );
        if (result) {
          return resolve({
            code: 200,
            data: result,
            message: "Status Of Selected Student Is Updated Successfully!",
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

//Route to  display challan with updated status

exports.displayupdatedchallan = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {
        const result = await Challan.find({}).populate("challan");
        console.log(result);
        if (result) {
          return resolve({
            code: 200,
            data: result,
            message: "Challans with updated Status Displayed Successfully!",
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