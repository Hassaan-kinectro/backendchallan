const Challan = require("../../model/challan");
const Student = require("../../model/student");
const Class = require("../../model/class");
const dateFns = require("date-fns");

//Route to  generate challans for student by their classnames

exports.generatechallan = (req) => {
  return new Promise(async (resolve, reject) => {
    (async () => {
      try {
        const { className } = req.body;
        console.log("flag8", req.body);
        if (!className) {
          return reject({
            code: 402,
            message: "input is required",
          });
        }
        const result = await Class.findOne({ className }).lean();
        const { fees } = result;
        console.log("hjg", result);
        const students = await Student.find({
          className,
          mode: [2, 4, 1],
        }).lean();
        console.log(students);

        //Generating Issue Date
        const dateObj = new Date();
        let date = ("0" + dateObj.getDate()).slice(-2);
        let month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        let year = dateObj.getFullYear();
        const issueDate = year + "-" + month + "-" + date;

        //  console.log("Issue Date:", issueDate);
        //  console.log("Due Date", dueDate);
        let finalFees, IssueData, DueDate;

        students.forEach(async (element) => {
          let d = new Date();
          d.setDate(d.getDate() + 21 * element.mode);
          const dueDate = JSON.stringify(d).split("T")[0].slice(1);
          finalFees = element.mode * fees;
          IssueData = issueDate;
          DueDate = dueDate;

          const saveChallan = async () => {
            const newChallan = await Challan.create({
              classFees: finalFees,
              issueDate: IssueData,
              dueDate: DueDate,
              challan: element._id,
              mode: element.mode,
            });
          };
          saveChallan();
            if (element.mode == 1) {
              console.log("fghj");
              const str = DueDate;
              const date = new Date(str);

              //add one month
              const addedMonthDate = dateFns.addMonths(date, 1);

              //set date to 1st
              const changedIssueDate = dateFns.setDate(addedMonthDate, 1);

              const changedIssueDateCopy = new Date(changedIssueDate);

              //add 3 weeks in issue date to make due date
              let changedDueDate = changedIssueDateCopy.setDate(
                changedIssueDateCopy.getDate() + 21
              );
              const changedDueDateLatest = new Date(changedDueDate);

              const changedIssueDateStr = JSON.stringify(changedIssueDate)
                .split("T")[0]
                .slice(1);
              console.log(changedIssueDateStr);

              const changedDueDateStr = JSON.stringify(changedDueDateLatest)
                .split("T")[0]
                .slice(1);
              console.log(changedIssueDateStr);
              const newChallan1 = await Challan.create({
                classFees: finalFees,
                issueDate: changedIssueDateStr,
                dueDate: changedDueDateStr,
                challan: element._id,
                mode: element.mode,
              });
              newChallan1();
            };
        });
        // console.log(students);
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
        if (!challanId || !status || !updatedClassFees) {
          return reject({
            code: 402,
            message: "Inputs are required",
          });
        };
        const result = await Challan.findOneAndUpdate(
          { _id: challanId },
          { status },
          { new: true }
        );
        // console.log("flag12",result.status);
        console.log("success", result);
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
