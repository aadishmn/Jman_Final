const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  PID: {
    type: String,
    required: true,
    unique: true,
  },
  client_name: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
    required: true,
  },
  end_date: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Custom setter function to format date as "dd-mm-yyyy"
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${day}-${month}-${year}`;
}

module.exports = mongoose.model("projects", projectSchema);
