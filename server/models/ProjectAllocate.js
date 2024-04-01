const mongoose = require('mongoose');


const projectAllocate = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    PID: {
      type: String,
      required: true
    },
    allocation_start: {
      type: Date,
      required: true
    },
    allocation_end: {
      type: Date,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  });
  

  module.exports = mongoose.model('projectAssignments', projectAllocate);