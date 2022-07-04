const mongoose = require("mongoose");

const ChallanSchema = new mongoose.Schema({
  classFees: { type: String },
  issueDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  challan: { type: "ObjectId", ref: "Student" },
  status: { type: String, required: true }
});

module.exports = mongoose.model("challan", ChallanSchema);
