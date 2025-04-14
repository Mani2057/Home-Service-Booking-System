const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session Middleware (must be before routes)
app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

// Routes (after session middleware)
app.use("/auth", require("./routes/auth"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/booking", require("./routes/booking"));
app.use("/my-bookings", require("./routes/my-bookings"));

const db=process.env.MONGO_URI ;
// ||'mongodb://localhost:27017/yourDatabase'
//  MongoDB Connection
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// mongoose.connect('mongodb://localhost:27017/yourDatabase')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

//  Landing Page
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/dashboard");
  }
  res.render("login", { message: req.flash("error") });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
