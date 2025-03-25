const express = require("express");
const router = express.Router();

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/auth/login");
}

// Dashboard Route (Protected)
router.get("/", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

module.exports = router;
