const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  req.flash("error", "You must log in first.");
  res.redirect("/");
}

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const bookings = await Booking.find({ userId });
    res.render("my-bookings", { bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.userId.toString() !== req.session.user._id) {
      req.flash("error", "Unauthorized access.");
      return res.redirect("/my-bookings");
    }
    res.render("edit-booking", { booking });
  } catch (err) {
    console.error("Edit page error:", err);
    res.redirect("/my-bookings");
  }
});

router.post("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const { name, address, timing } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.userId.toString() !== req.session.user._id) {
      req.flash("error", "Unauthorized update.");
      return res.redirect("/my-bookings");
    }

    booking.name = name;
    booking.address = address;
    booking.timing = timing;
    await booking.save();

    req.flash("success", "Booking updated successfully.");
    res.redirect("/my-bookings");
  } catch (err) {
    console.error("Error updating booking:", err);
    res.redirect("/my-bookings");
  }
});

router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.userId.toString() !== req.session.user._id) {
      req.flash("error", "Unauthorized delete.");
      return res.redirect("/my-bookings");
    }
    await Booking.findByIdAndDelete(req.params.id);
    req.flash("success", "Booking deleted successfully.");
    res.redirect("/my-bookings");
  } catch (err) {
    console.error("Delete error:", err);
    res.redirect("/my-bookings");
  }
});

module.exports = router;
