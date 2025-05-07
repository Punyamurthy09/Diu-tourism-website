const nodemailer = require("nodemailer");
const express = require('express');
const router = express.Router();
const db = require('../db');

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: 'diutourismproject@gmail.com',
    pass: 'lgwn gzlc xqhx wwhq'
  }
});

router.get('/', (req, res) => {
  console.log("request received");
  const sql = `SELECT * FROM users WHERE date_of_trip = CURDATE() + INTERVAL 1 DAY AND email_send_status = 0`;

  db.query(sql, async (err, users) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database query failed.");
    }

    if (users.length === 0) {
      return res.send("No upcoming trips found.");
    }

    for (const user of users) {
      const userName = user.user_name;
      const email = user.email;
      const tableName = `event_plan_${userName}`; // ✅ Corrected template string

      const eventSql = `SELECT activity, column_name FROM \`${tableName}\` WHERE column_name IN ('day1', 'day2', 'day3')`; // ✅ Escaped table name

      try {
        const [events] = await new Promise((resolve, reject) => {
          db.query(eventSql, (err, results) => {
            if (err) reject(err);
            else resolve([results]);
          });
        });

        const dayPlan = { day1: [], day2: [], day3: [] };
        events.forEach(event => {
          if (dayPlan[event.column_name]) {
            dayPlan[event.column_name].push(event.activity);
          }
        });

        const generateDayList = (day, activities) => {
          if (activities.length === 0) return '';
          return `
            <h3>${day.toUpperCase()}</h3>
            <ul>
              ${activities.map(act => `<li>${act}</li>`).join("")}  <!-- ✅ Fixed map -->
            </ul>
          `;
        };

        const mailHtml = `
          <h2>Hello ${userName},</h2>
          <p>Here’s your personalized plan for your Diu trip tomorrow:</p>
          ${generateDayList("day1", dayPlan.day1)}
          ${generateDayList("day2", dayPlan.day2)}
          ${generateDayList("day3", dayPlan.day3)}
          <p>Enjoy your trip!<br><strong>Diu Tourism</strong></p>
        `;

        const mailOptions = {
          from: {
            name: "Diu Tourism",
            address: 'diutourismproject@gmail.com'
          },
          to: email,
          subject: `Your Diu Trip Plan`,
          html: mailHtml
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);

        // ✅ Corrected update query syntax
        db.query(`UPDATE users SET email_send_status = 1 WHERE email = ?`, [email]);
      } catch (error) {
        console.error(`Error for ${userName}:`, error);
      }
    }

    res.send("Emails processed.");
  });
});

module.exports = router;



// const nodemailer = require("nodemailer");
// const express = require('express');
// const router = express.Router();
// const db = require('../db'); // Ensure this is your database connection

// const transporter  = nodemailer.createTransport({
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'diutourismproject@gmail.com',
//     pass: 'lgwn gzlc xqhx wwhq'
//   }
// });

// // Example route to send email based on a query
// router.get('/', (req, res) => {
//   console.log("ready to send mail");
//   // Replace with your actual query
//   const sql = `SELECT * FROM users WHERE date_of_trip = CURDATE() + INTERVAL 1 DAY && email_send_status=0`;
//   console.log("hi");

//   db.query(sql, async (err, results) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).send("Database query failed.");
//     }

//     if (results.length === 0) {
//       return res.send("No upcoming events found.");
//     }
//     console.log(res.results);
//     // Example: convert result rows to HTML table
//     const rowsHtml = results.map(row => 
//       `<tr><td>${row.name}</td><td>${row.email}</td><td>${row.date_of_trip}</td></tr>`
//     ).join("");

//     const mailOptions = {
//       from: {
//         name: "Diu Tourism",
//         address: 'diutourismproject@gmail.com'
//       },
//       to: "3366alokyadav@gmail.com, 202311008@diu.iiitvadodara.ac.in", // static or dynamic
//       subject: "Upcoming Events from Diu Tourism",
//       html: `
//         <h2>Upcoming Events:</h2>
//         <table border="1" cellpadding="5">
//           <tr><th>Name</th><th>Email</th><th>Date</th></tr>
//           ${rowsHtml}
//         </table>
//       `
//     };

//     try {
//       await transporter.sendMail(mailOptions);
//       console.log("Email sent");
//       res.send("Email sent successfully with event data.");
//     } catch (error) {
//       console.error("Email error:", error);
//       res.status(500).send("Failed to send email.");
//     }
//   });
// });

// module.exports = router;


// // const nodemailer = require("nodemailer");


// // const transporter  = nodemailer.createTransport({
// //   service : "gmail",
// //     host: "smtp.gmail.com",
// //     port: 465,
// //     secure: true, // true for port 465, false for other ports
// //     auth: {
// //  user: 'diutourismproject@gmail.com',
// //         pass: 'lgwn gzlc xqhx wwhq'
// //     },
// //   });

// // const mailOptions = {
// //   from:{
// //     name : "Diu Tourism",
// //     address : 'diutourismproject@gmail.com'
// //   }, 
// //   to: ["3366alokyadav@gmail.com,202311008@diu.iiitvadodara.ac.in"], 
// //   subject: "send mail using nodemailer and js", 
// //   text: "Welcome to Diu?", 
// //   html: "<b>Hello world amit?</b>", 
// // }
// // const sendMail = async (transporter,mailOptions) =>{
// //   try {
// //     await transporter.sendMail(mailOptions);
// //     console.log("emial sendj");
    
// //   }
// //   catch (error){
// //     console.error(error);
    
// //   }
// // }
// // sendMail(transporter,mailOptions);
