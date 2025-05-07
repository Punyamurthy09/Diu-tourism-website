const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Fetch all feedback for a specific place
router.get("/:placename/feedback", (req, res) => {
  const placename = req.params.placename;
  db.query(`SELECT * FROM ${placename}_feedback order by d_ate asc`, (err, result) => {
    if (err) {
      console.error("Database Error: ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(result);
  });
});

// ✅ Post feedback for a specific place
router.post("/:placename/feedback", (req, res) => {
  const placename = req.params.placename;
  const { feedback } = req.body;

  if (!req.session.user) {
    return res.status(401).send("You have not logged in");
  }

  const user_email = req.session.user.email;

  // 🔹 Check if user has already commented
  const checkQuery = `SELECT * FROM \`${placename}_feedback\` WHERE email = ?`;
  db.query(checkQuery, [user_email], (err, result) => {
    if (err) {
      console.error("Database Error: ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "You can comment only once" });
    }

    // 🔹 Fetch user name
    const findUserName = `SELECT user_name FROM users WHERE email = ?`;
    db.query(findUserName, [user_email], (err, results) => {
      if (err) {
        console.error("Database Error: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user_name = results[0].user_name;

      // 🔹 Insert feedback
      const insertFeedbackQuery = `
        INSERT INTO \`${placename}_feedback\` (email, user_name, likes, dislikes, user_comment, d_ate) 
        VALUES (?, ?, 0, 0, ?, NOW())`;

      db.query(insertFeedbackQuery, [user_email, user_name, feedback], (err, result) => {
        if (err) {
          console.error("Database Error: ", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json({
          message: "Feedback added successfully",
          feedback_id: result.insertId,
          email: user_email,
          user_name,
          feedback,
          likes: 0,
          dislikes: 0,
        });
      });
    });
  });
});



// // ✅ Like a feedback for a specific place
// router.post("/:placename/feedback/:email/like", (req, res) => {
//   const placename = req.params.placename;
//   db.query(
//     `UPDATE ${placename}_feedback SET likes = likes + 1 WHERE email = ?`,
//     [req.params.email],
//     (err) => {
//       if (err) {
//         console.error("Database Error: ", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.send("Liked");
//     }
//   );
// });

// // ✅ Dislike a feedback for a specific place
// router.post("/:placename/feedback/:email/dislike", (req, res) => {
//   const placename = req.params.placename;
//   db.query(
//     `UPDATE ${placename}_feedback SET dislikes = dislikes + 1 WHERE email = ?`,
//     [req.params.email],
//     (err) => {
//       if (err) {
//         console.error("Database Error: ", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//       }
//       res.send("Disliked");
//     }
//   );
// });

// ✅ Like a feedback for a specific place
router.post("/:placename/feedback/:email/like", async (req, res) => {
  const { email } = req.params;
  const userId = req.session.user?.id;

  if (!userId) {
      return res.status(401).json({ error: "You must be logged in to vote" });
  }

  try {
      await db.query('BEGIN');

      // Check if the user has already voted
      const existingVote = await db.query(
          `SELECT * FROM nagoa_votes WHERE feedback_email = $1 AND user_id = $2`,
          [email, userId]
      );

      if (existingVote.rows.length > 0) {
          const vote = existingVote.rows[0];

          if (vote.vote_type === 'like') {
              // Remove like
              await db.query(`DELETE FROM nagoa_votes WHERE id = $1`, [vote.id]);
              await db.query(
                  `UPDATE nagoa_feedback SET likes = GREATEST(likes - 1, 0) WHERE email = $1`,
                  [email]
              );
              await db.query('COMMIT');
              return res.json({ action: 'removed', type: 'like' });
          } else {
              // Switch from dislike to like
              await db.query(`UPDATE nagoa_votes SET vote_type = 'like' WHERE id = $1`, [vote.id]);
              await db.query(
                  `UPDATE nagoa_feedback 
                   SET likes = likes + 1, dislikes = GREATEST(dislikes - 1, 0) 
                   WHERE email = $1`,
                  [email]
              );
              await db.query('COMMIT');
              return res.json({ action: 'switched', from: 'dislike', to: 'like' });
          }
      } else {
          // Add new like
          await db.query(
              `INSERT INTO nagoa_votes (feedback_email, user_id, vote_type) VALUES ($1, $2, 'like')`,
              [email, userId]
          );
          await db.query(`UPDATE nagoa_feedback SET likes = likes + 1 WHERE email = $1`, [email]);
          await db.query('COMMIT');
          return res.json({ action: 'added', type: 'like' });
      }
  } catch (err) {
      await db.query('ROLLBACK');
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Dislike or remove dislike
router.post("/:placename/feedback/:email/dislike", async (req, res) => {
  const { email } = req.params;
  const userId = req.session.user?.id;

  if (!userId) {
      return res.status(401).json({ error: "You must be logged in to vote" });
  }

  try {
      await db.query('BEGIN');

      // Check if the user has already voted
      const existingVote = await db.query(
          `SELECT * FROM nagoa_votes WHERE feedback_email = $1 AND user_id = $2`,
          [email, userId]
      );

      if (existingVote.rows.length > 0) {
          const vote = existingVote.rows[0];

          if (vote.vote_type === 'dislike') {
              // Remove dislike
              await db.query(`DELETE FROM nagoa_votes WHERE id = $1`, [vote.id]);
              await db.query(
                  `UPDATE nagoa_feedback SET dislikes = GREATEST(dislikes - 1, 0) WHERE email = $1`,
                  [email]
              );
              await db.query('COMMIT');
              return res.json({ action: 'removed', type: 'dislike' });
          } else {
              // Switch from like to dislike
              await db.query(`UPDATE nagoa_votes SET vote_type = 'dislike' WHERE id = $1`, [vote.id]);
              await db.query(
                  `UPDATE nagoa_feedback 
                   SET dislikes = dislikes + 1, likes = GREATEST(likes - 1, 0) 
                   WHERE email = $1`,
                  [email]
              );
              await db.query('COMMIT');
              return res.json({ action: 'switched', from: 'like', to: 'dislike' });
          }
      } else {
          // Add new dislike
          await db.query(
              `INSERT INTO nagoa_votes (feedback_email, user_id, vote_type) VALUES ($1, $2, 'dislike')`,
              [email, userId]
          );
          await db.query(`UPDATE nagoa_feedback SET dislikes = dislikes + 1 WHERE email = $1`, [email]);
          await db.query('COMMIT');
          return res.json({ action: 'added', type: 'dislike' });
      }
  } catch (err) {
      await db.query('ROLLBACK');
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get current vote status
router.get("/:placename/feedback/:email/vote-status", async (req, res) => {
  const { email } = req.params;
  const userId = req.session.user?.id;

  if (!userId) {
      return res.status(401).json({ error: "Not logged in" });
  }

  try {
      const result = await db.query(
          `SELECT vote_type FROM nagoa_votes WHERE feedback_email = $1 AND user_id = $2`,
          [email, userId]
      );

      if (result.rows.length > 0) {
          return res.json({ voteType: result.rows[0].vote_type });
      }
      return res.json({ voteType: null });
  } catch (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get vote status for a feedback
router.get("/:placename/feedback/:email/vote-status", async (req, res) => {
    const { email } = req.params;
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        const result = await db.query(
            `SELECT vote_type FROM nagoa_votes 
             WHERE feedback_email = $1 AND user_id = $2`,
            [email, userId]
        );

        if (result.rows.length > 0) {
            return res.json({ voteType: result.rows[0].vote_type });
        }
        return res.json({ voteType: null });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});




// ✅ Get replies for a specific feedback
router.get("/:placename/feedback/:email/replies", (req, res) => {
  const placename = req.params.placename;
  const email = req.params.email.trim(); // Trim whitespace

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  db.query(
    `SELECT * FROM ${placename}_replies WHERE email = ?`,
    [email],
    (err, result) => {
      if (err) {
        console.error("Database Error: ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No replies found for this user" });
      }

      res.json(result);
    }
  );
});

// ✅ Add a reply to a specific feedback
router.post("/:placename/feedback/:email/reply", (req, res) => {
  const placename = req.params.placename;
  const { reply } = req.body;
  const replier_email = req.session.user.email;
  const feedback_user_email = req.params.email;

  console.log(`Adding reply: ${reply}`);

  // First query: Get the user_name of the replier
  db.query(
    "SELECT user_name FROM users WHERE email = ?",
    [replier_email],
    (err, result) => {
      if (err) {
        console.error("Database Error (fetching user_name): ", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Replier user not found" });
      }

      const feedback_user_name = result[0].user_name;

      // Second query: Insert the reply into the specific place's reply table
      const insertQuery = `
        INSERT INTO ${placename}_replies 
        (email, feedback_user_name, replier_email, replier_comment, d_ate) 
        VALUES (?, ?, ?, ?, NOW())
      `;

      db.query(
        insertQuery,
        [feedback_user_email, feedback_user_name, replier_email, reply],
        (err) => {
          if (err) {
            console.error("Database Error (inserting reply): ", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          console.log("Reply added successfully");
          res.send("Reply added");
        }
      );
    }
  );
});



module.exports = router;
