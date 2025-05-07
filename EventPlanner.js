const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all event plans for the logged-in user
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const findName = "SELECT user_name FROM users WHERE email = ?";

  db.query(findName, [req.session.user.email], (err, result) => {
    if (err) {
      console.error("Database Error (user lookup):", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user_name = result[0].user_name;
    const tableName = `event_plan_${user_name}`;
    const sql = `SELECT * FROM \`${tableName}\``;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Database Error (event fetch):", err);
        return res.status(500).json({ error: "Error fetching event plans" });
      }

      res.json(results);
    });
  });
});

// Save tasks (ONLY tasks, NOT date)
router.post("/save", (req, res) => {
  const { tasks } = req.body;

  console.log("Received tasks:", JSON.stringify(tasks, null, 2));

  if (!Array.isArray(tasks)) {
    return res.status(400).json({ success: false, error: "Invalid task format" });
  }

  const findName = "SELECT user_name FROM users WHERE email = ?";

  db.query(findName, [req.session.user.email], (err, result) => {
    if (err) {
      console.error("Database Error (user lookup):", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user_name = result[0].user_name;
    const tableName = `event_plan_${user_name}`;
    const updateTaskQuery = `UPDATE ${tableName} SET column_name = ? WHERE activity = ?`;

    const updatePromises = tasks.map(task => {
      return new Promise((resolve, reject) => {
        console.log(`Updating: ${task.activity} to ${task.column_name}`);
        db.query(updateTaskQuery, [task.column_name, task.activity], (err, result) => {
          if (err) {
            console.error("Error updating task:", err);
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    Promise.all(updatePromises)
      .then(() => {
        res.json({ success: true, message: "Tasks updated successfully" });
      })
      .catch(error => {
        console.error("Database update error:", error);
        res.status(500).json({ success: false, error: error.message });
      });
  }); // 🔴 this one was missing
}); // ✅ closing router.post

module.exports = router;
