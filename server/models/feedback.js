const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedbackSchema = new Schema({
    email:{ type: String, required: true },
    role:{ type: String, required: true },
    q1:{ type: Number, required: true },
    q2:{ type: Number, required: true },
    q3:{ type: Number, required: true },
    q4:{ type: Number, required: true },
    q5:{ type: Number, required: true },
    q6:{ type: Number, required: true },
    comments:String,
    // filled: { type: Boolean, default: false }   ,
  created_at: {
    type: Date,
    default: Date.now
  }
    
}, {
    collection: 'feedbacks',timestamps: true
})
module.exports = mongoose.model('Feedback', feedbackSchema)   