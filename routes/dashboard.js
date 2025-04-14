const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking"); // import model

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/auth/login");
}

// Dashboard Route (Protected)
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.session.user._id });

    res.render("dashboard", {
      user: req.session.user,
      bookings,
      message: req.flash("success"),
      error: req.flash("error")
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.render("dashboard", {
      user: req.session.user,
      bookings: [],
      message: [],
      error: ["Something went wrong while loading bookings."]
    });
  }
});

module.exports = router;
