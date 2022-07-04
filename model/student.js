const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, minlength: 3 },
  lastName: { type: String, trim: true },
  className: { type: String, trim: true },
  mode: { type: Number, required:true, enum:[ 1, 2 , 4 ] },
  Updatedstatus: { type: String }
  // _classId: { type: mongoose.Schema.Types.ObjectId, ref: "Classs" }
});



module.exports = mongoose.model("Student", StudentSchema);

