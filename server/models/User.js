// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role:{type:String,required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  hasChanged:{type: Boolean, default: false},
  otp:{type: Number}
});

module.exports = mongoose.model('User', userSchema);
