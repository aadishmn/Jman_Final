const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    PID: {
      type: String,
      required: true,
      unique: true
    },
    client_name : {
      type:String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = mongoose.model('projects', projectSchema);