const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// GET booking form
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  res.render("booking");
});

// POST booking form
router.post("/", async (req, res) => {
  const { name, address, timing } = req.body;

  try {
    const booking = new Booking({
      name,
      address,
      timing,
      userId: req.session.user._id
    });

    await booking.save();

    req.flash("success", "Booking successful!");
    res.redirect("/dashboard"); // <-- we'll show the message there
  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/booking");
  }
});

module.exports = router;
