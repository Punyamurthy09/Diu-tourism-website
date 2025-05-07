const express = require('express');
const router = express.Router();
const db = require('../db');
const passport = require('passport');

// User Registration
router.post('/', (req, res) => {
    const { user_name, email, user_password } = req.body;

    if (!user_name || !email || !user_password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert user into users table
    const sql = 'INSERT INTO users (user_name, email, user_password) VALUES (?, ?, ?)';
    db.query(sql, [user_name, email, user_password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        console.log("User inserted:", user_name, email);

        // Create dynamic table name (avoid special characters in user_name ideally)
        const tableName = `event_plan_${user_name.replace(/\W/g, '')}`;  // sanitize

        const sql2 = `
            CREATE TABLE \`${tableName}\` (
                activity VARCHAR(50),
                column_name VARCHAR(20)
            )
        `;

        console.log("Creating table:", tableName);

        db.query(sql2, (err) => {
            if (err) {
                return res.status(500).json({ error: "Table creation failed: " + err.message });
            }

            // Insert default activities
            const insertQuery = `
                INSERT INTO \`${tableName}\` (activity, column_name) VALUES 
                ('Nagoa', 'todo'), 
                ('Ghoghla', 'todo'), 
                ('Chakratirth', 'todo'), 
                ('Jallandhar', 'todo'), 
                ('Gomtimata', 'todo'), 
                ('DiuFort', 'todo'), 
                ('PaniKotha', 'todo'), 
                ('Gangeshwar', 'todo'),
                ('NadiaCaves', 'todo'), 
                ('St Paul Church', 'todo'), 
                ('INS Khukhri Memorial', 'todo'), 
                ('Sea Shell Museum', 'todo')
            `;

            db.query(insertQuery, (err) => {
                if (err) {
                    return res.status(500).json({ error: "Insert default activities failed: " + err.message });
                }

                res.status(201).json({
                    message: 'User and event table created successfully with default activities',
                    userName: user_name
                });
            });
        });
    });
});

// Google Authentication Route
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failed',
        successRedirect: '/dashboard'
    })
);

module.exports = router;


// // // const express = require('express');
// // // const router = express.Router();
// // // const db = require('../db');

// // // router.post('/', (req, res) => {
// // //     const { user_name, email, user_password } = req.body;

// // //     if (!user_name || !email || !user_password) {
// // //         return res.status(400).json({ error: 'All fields are required' });
// // //     }

// // //     const sql = 'INSERT INTO users (user_name, email, user_password) VALUES (?, ?, ?)';
// // //     db.query(sql, [user_name, email, user_password], (err, result) => {
// // //         if (err) {
// // //             return res.status(500).json({ error: err.message });
// // //         }

// // //         // Set a session cookie after signup (if applicable)
// // //         res.cookie("session_id", "some-session-value", { httpOnly: true, sameSite: "strict" });

// // //         res.status(201).json({ message: 'User added successfully', userId: result.insertId });
// // //     });
// // // });

// // // module.exports = router;

// // const express = require('express');
// // const router = express.Router();
// // const db = require('../db');

// // router.post('/', (req, res) => {
// //     const { user_name, email, user_password } = req.body;

// //     if (!user_name || !email || !user_password) {
// //         return res.status(400).json({ error: 'All fields are required' });
// //     }

// //     // Insert user into `users` table
// //     const sql = 'INSERT INTO users (user_name, email, user_password) VALUES (?, ?, ?)';
// //     db.query(sql, [user_name, email, user_password], (err, result) => {
// //         if (err) {
// //             return res.status(500).json({ error: err.message });
// //         }

// //         console.log(user_name, email, user_password);
// //         // Create a new event plan table for the user
// //         const tableName = `event_plan_${user_name}`; // Dynamically setting table name
// //         console.log("table name is ",tableName);
// //         const sql2 = `CREATE TABLE \`${tableName}\` (
// //                         activity VARCHAR(20),
// //                         column_name VARCHAR(20)
// //                       )`;


// //         console.log("after table", user_name, email, user_password);
// //         db.query(sql2, (err, result) => {
// //             if (err) {
// //                 return res.status(500).json({ error: err.message });
// //             }

// //             // Insert default rows into the new table
// //             const insertQuery = `INSERT INTO \`${tableName}\` (activity, column_name) VALUES 
// //                                 ('Nagoa', 'todo'), 
// //                                 ('Ghoghla', 'todo'), 
// //                                 ('Chakratirth', 'todo'), 
// //                                 ('Jallandhar', 'todo'), 
// //                                 ('Gomtimata', 'todo'), 
// //                                 ('DiuFort', 'todo'), 
// //                                 ('PaniKotha', 'todo'), 
// //                                 ('Gangeshwar', 'todo')`;

// //             console.log("after insertion", user_name, email, user_password);


// //             db.query(insertQuery, (err, result) => {
// //                 if (err) {
// //                     return res.status(500).json({ error: err.message });
// //                 }

// //                 res.status(201).json({ message: 'User and event table created successfully with default activities', userId: result.insertId });
// //             });
// //         });
// //     });
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const db = require('../db');
// const passport = require('passport');

// // User Registration
// router.post('/', (req, res) => {
//     const { user_name, email, user_password } = req.body;

//     if (!user_name || !email || !user_password) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     // Insert user into users table
//     const sql = 'INSERT INTO users (user_name, email, user_password, d_ate) VALUES (?, ?, ?,NOW())';
//     db.query(sql, [user_name, email, user_password], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }

//         console.log("User inserted:", user_name, email);

//         // Create dynamic table name (avoid special characters in user_name ideally)
//         const tableName = `event_plan_${user_name.replace(/\W/g, '')}`;  // sanitize

//         const sql2 = `
//             CREATE TABLE \`${tableName}\` (
//                 activity VARCHAR(50),
//                 column_name VARCHAR(20)
//             )
//         `;

//         console.log("Creating table:", tableName);

//         db.query(sql2, (err) => {
//             if (err) {
//                 return res.status(500).json({ error: "Table creation failed: " + err.message });
//             }

//             // Insert default activities
//             const insertQuery = `
//                 INSERT INTO \`${tableName}\` (activity, column_name) VALUES 
//                 ('Nagoa', 'todo'), 
//                 ('Ghoghla', 'todo'), 
//                 ('Chakratirth', 'todo'), 
//                 ('Jallandhar', 'todo'), 
//                 ('Gomtimata', 'todo'), 
//                 ('DiuFort', 'todo'), 
//                 ('PaniKotha', 'todo'), 
//                 ('Gangeshwar', 'todo')
//             `;

//             db.query(insertQuery, (err) => {
//                 if (err) {
//                     return res.status(500).json({ error: "Insert default activities failed: " + err.message });
//                 }

//                 res.status(201).json({
//                     message: 'User and event table created successfully with default activities',
//                     userName: user_name
//                 });
//             });
//         });
//     });
// });

// // Google Authentication Route
// router.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     prompt: 'select_account'
// }));

// router.get('/auth/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: '/login-failed',
//         successRedirect: '/dashboard'
//     })
// );

// module.exports = router;


