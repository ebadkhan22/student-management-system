const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/register', async (req, res) => {
  const { name, email, age } = req.body;
  const newStudent = new Student({ name, email, age });
  await newStudent.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Registration Confirmation',
    text: `Hello ${name},\n\nYou have successfully registered.\n\nThank you!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });

  res.redirect('/');
});

router.get('/profile/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  res.render('profile', { student });
});

module.exports = router;
