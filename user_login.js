const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const router = express.Router();
const db = require("../db");
const passport = require('passport');
require("dotenv").config();

// MySQL Session Store Configuration
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "reus11rocks",
  database: process.env.DB_NAME || "SE_Project",
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
});


router.use(
  session({
    key: "session_cookie_name",
    secret: process.env.SESSION_SECRET || "your_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 86400000,
    },
  })
);

// User Login (Session-based)
router.post("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const sql = "SELECT email, user_password,date_of_trip FROM users WHERE email = ? AND user_password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store user details in session (MySQL-based)
    req.session.user = {
      email: results[0].email,
      date_of_trip:results[0].date_of_trip
    };
    req.session.save((err) => {
      if (err) return res.status(500).json({ error: "Session save failed" });
      res.json({ message: "Login successful", user: req.session.user });
    });
  });
});

router.post("/update", (req, res) => {
  const { date_of_trip } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "User not logged in" });
  }

  const user_name = req.session.user.email;

  // ✅ Ensure date is saved without timezone issues
  const formattedDate = new Date(date_of_trip).toISOString().split("T")[0];

  const sql = "UPDATE users SET date_of_trip = ? WHERE email = ?";
  db.query(sql, [formattedDate, user_name], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    // ✅ Update session to avoid mismatch after saving
    req.session.user.date_of_trip = formattedDate;

    res.json({ success: true, message: "Date updated successfully", updatedDate: formattedDate });
  });
});


// Check Login Status
router.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("session_cookie_name"); // Clear session cookie
    res.json({ message: "Logged out successfully" });
  });
});

// Google Login Status Check
router.get('/auth/google/session', (req, res) => {
  if (req.user) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;


// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const MySQLStore = require("express-mysql-session")(session);
// const router = express.Router();
// const db = require("../db");
// const passport = require('passport');
// require("dotenv").config();

// // MySQL Session Store Configuration
// const sessionStore = new MySQLStore({
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASS || "4268Mysql*",
//   database: process.env.DB_NAME || "SE_Project",
//   clearExpired: true,
//   checkExpirationInterval: 900000,
//   expiration: 86400000,
// });


// router.use(
//   session({
//     key: "session_cookie_name",
//     secret: process.env.SESSION_SECRET || "your_secret_key",
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//       httpOnly: true,
//       maxAge: 86400000,
//     },
//   })
// );

// // User Login (Session-based)
// router.post("/", (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required" });
//   }

//   const sql = "SELECT email, user_password FROM users WHERE email = ? AND user_password = ?";
//   db.query(sql, [email, password], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

//     if (results.length === 0) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     // Store user details in session (MySQL-based)
//     req.session.user = {
//       email: results[0].email,
//     };
//     req.session.save((err) => {
//       if (err) return res.status(500).json({ error: "Session save failed" });
//       res.json({ message: "Login successful", user: req.session.user });
//     });
//   });
// });

// // Check Login Status
// router.get("/session", (req, res) => {
//   if (req.session.user) {
//     res.json({ loggedIn: true, user: req.session.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

// // Logout Route
// router.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({ error: "Logout failed" });
//     res.clearCookie("session_cookie_name"); // Clear session cookie
//     res.json({ message: "Logged out successfully" });
//   });
// });

// // Google Login Status Check
// router.get('/auth/google/session', (req, res) => {
//   if (req.user) {
//     res.json({ loggedIn: true, user: req.user });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

// module.exports = router;
