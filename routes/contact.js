const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// GET: Show contact page
router.get('/', (req, res) => {
  res.render('contact');
});

// POST: Handle form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.redirect('/dashboard'); // or show a success message
  } catch (error) {
    console.error('Error saving contact message:', error);
    res.status(500).send('Something went wrong.');
  }
});

module.exports = router;
