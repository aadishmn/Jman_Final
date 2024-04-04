// authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require("nodemailer");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if(user.hasChanged==false){
      return res.status(401).json({ message: 'change new pasword' });

    }
    else{
    if (!user || (password!=user.password) ) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  }
    

    const token = jwt.sign({ userId: user._id,email:user.email, isAdmin: user.isAdmin,role:user.role  }, process.env.JWT_SECRET);
    res.json({ token, isAdmin: user.isAdmin,id:user._id,hasChanged:user.hasChanged,role:user.role }); 
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
  const { firstName, lastName, email, password ,role} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: password,
      role,
      hasChanged:false,
      // isAdmin: false // Set isAdmin based on the authenticated user
    });

    await newUser.save();
    sendEmail(email, password);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }

  
};

const change_password = async (req, res) => {
  try {   
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password } = req.body;
    user.password = password;
    user.hasChanged = true;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


function sendEmail(email, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dhiyanesh7338942092@gmail.com",
      pass: "srle egmw ikwz mzog",
    },
  });
  const change_password = "http://localhost:3000/login";
  const mailOptions = {
    from: "dhiyanesh7338942092@gmail.com",
    to: email,
    subject: "Welcome to Our Website!",
    text: `Welcome! Your account has been created with the default password: ${password}. 
           Please login to our website and change your password. ${change_password}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

const forgot_password = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.hasChanged=false
    id=user._id
    // Generate a unique token with user's ID and a secret key
    const token = jwt.sign(
      { userId: user._id },
      process.env.PASSWORD_RESET_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    // Send password reset email
    await sendPasswordResetEmail(email, token,id);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
async function sendPasswordResetEmail(email, token) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dhiyanesh7338942092@gmail.com",
        pass: "srle egmw ikwz mzog",
      },
    });
    const resetLink = `${process.env.BASE_URL}/${id}`;
    const mailOptions = {
      from: "dhiyanesh7338942092@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello,</p>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}


module.exports = {
  login,
  register,
  change_password,
  forgot_password
}