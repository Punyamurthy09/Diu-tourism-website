const express = require("express");
const router = express.Router();
const db = require("../db");

// Corrected: Use router instead of app
router.get("/adminshow", (req, res) => {
    db.query("SELECT * FROM admin", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

router.post("/admindata", (req, res) => {
    const { admin_name, password } = req.body;
    if (!admin_name || !password) {
        return res.status(400).json({ error: "Both fields are required" });
    }

    const sql = "INSERT INTO admin (admin_name, password) VALUES (?, ?)";
    db.query(sql, [admin_name, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Admin added successfully" });
    });
});

// Export the router (NOT app)
module.exports = router;
