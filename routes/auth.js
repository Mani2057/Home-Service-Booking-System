const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.get("/signup", (req, res) => {
  res.render("signup", { message: req.flash("error") });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      req.flash("error", "User already exists!");
      return res.redirect("/auth/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });

    await user.save();
    req.flash("success", "Account created!");
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

// Login Route
router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("error") });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect("/auth/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid credentials!");
      return res.redirect("/auth/login");
    }

    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
