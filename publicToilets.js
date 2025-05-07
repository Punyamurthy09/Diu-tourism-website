const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming this exports a working MySQL connection

// Fetch all public toilets
router.get("/", (req, res) => {
  const query = "SELECT name, lat, lng FROM public_toilets";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results); // always nice to set status explicitly
  });
});

router.post("/", (req, res) => {
    const { name, lat, lng } = req.body;
  
    // ✅ Validate incoming data
    if (!name || !lat || !lng) {
      return res.status(400).json({ error: "Missing required fields: name, lat, or lng" });
    }
  
    const query = "INSERT INTO public_toilets (name, lat, lng) VALUES (?, ?, ?)";
  
    db.query(query, [name, lat, lng], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // ✅ Send back success message and insert ID
      res.status(200).json({
        message: "Toilet location added successfully",
        insertedId: results.insertId
      });
    });
  });
  

module.exports = router;
