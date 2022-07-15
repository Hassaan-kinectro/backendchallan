const mongoose = require("mongoose");

const ChallanSchema = new mongoose.Schema({
  classFees: { type: String },
  issueDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  challan: { type: "ObjectId", ref: "Student" },
  status: { type: String },
  mode: { type: Number, required: true, enum: [1, 2, 4] },
});

module.exports = mongoose.model("challan", ChallanSchema);
