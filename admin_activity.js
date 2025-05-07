const express = require('express');
const router = express.Router();
const db = require('../db'); // Ensure you have the correct path to your database connection file

// ------------------ ADD Queries ------------------
// Add a new hotel
console.log("hello admin");
router.post('/addHotel', (req, res) => {
    const { name, website, address, phone } = req.body;

    db.query('INSERT INTO hotels (name, address, phone, website) VALUES (?, ?, ?, ?)',
        [name, address, phone, website],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Hotel added successfully' });
        });
});

// Add a new restaurant
router.post('/addRestaurant', (req, res) => {
    const { name, address, phone, type, openTime, closeTime } = req.body;

    db.query('INSERT INTO Restaurants (name, address, phone, type, open_time, close_time) VALUES (?, ?, ?, ?, ?, ?)',
        [name, address, phone, type, openTime, closeTime],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Restaurant added successfully' });
        });
});

// Add a new local bus route
router.post('/addLocalBus', (req, res) => {
    const { from_location, to_location, bus_time, cost } = req.body;

    db.query('INSERT INTO local_buses (from_location, to_location, bus_time, cost) VALUES (?, ?, ?, ?)',
        [from_location, to_location, bus_time, cost],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Local bus added successfully' });
        });
});

// Add a new state bus route
router.post('/addStateBus', (req, res) => {
    console.log("statebus");
    const { from_location, to_location, start_time, end_time, travels, cost } = req.body;

    db.query('INSERT INTO state_buses (from_location, to_location, start_time, end_time, travels, cost) VALUES (?, ?, ?, ?, ?, ?)',
        [from_location, to_location, start_time, end_time, travels, cost],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'State bus added successfully' });
        });
});

// Add a new flight
router.post('/addFlight', (req, res) => {
    const { from, to, timing, name } = req.body;

    db.query('INSERT INTO flights (from_location, to_location, flight_time, airline) VALUES (?, ?, ?, ?)',
        [from, to, timing, name],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Flight added successfully' });
        });
});

router.post('/addRickshaw', (req, res) => {
    const { driver_name, phone } = req.body;
    console.log(driver_name, phone);

    db.query('INSERT INTO rickshaw (driver_name, phone) VALUES (?, ?)',
        [driver_name, phone],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Rickshaw added successfully' });
        });
});

// ------------------ DELETE Queries ------------------

// Delete a hotel by name
router.post('/removeHotel', (req, res) => {
    const { hotelName, location } = req.body;

    db.query(
        'DELETE FROM hotels WHERE name = ? AND address = ?',
        [hotelName, location],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Hotel deleted successfully' });
        }
    );
});



// Delete a restaurant by name
router.post('/removeRestaurant', (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        return res.status(400).json({ error: "Both name and Location are required." });
    }

    db.query('DELETE FROM restaurants WHERE name = ? and address= ?', [name, address], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Restaurant deleted successfully' });
    });
});

// Delete a local bus route
router.post('/removeLocalBus', (req, res) => {
    const { from_location, to_location, bus_time } = req.body;

    db.query('DELETE FROM local_buses WHERE from_location = ? AND to_location = ? AND bus_time = ?',
        [from_location, to_location, bus_time],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Local bus deleted successfully' });
        });
});

// Delete a state bus route
router.post('/removeStateBus', (req, res) => {
    const { from_location, to_location, start_time, end_time, travels } = req.body;

    db.query('DELETE FROM State_buses WHERE from_location = ? AND to_location = ? AND start_time=? AND end_time=? AND travels=?',
        [from_location, to_location, start_time, end_time, travels],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'State bus deleted successfully' });
        });
});

// Delete a flight route
router.post('/removeFlight', (req, res) => {
    const { from, to } = req.body;

    db.query('DELETE FROM flights WHERE from_location = ? AND to_location = ?',
        [from, to],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Flight deleted successfully' });
        });
});

router.post('/removeRickshaw', (req, res) => {
    console.log(req.body);
    const { driver_name, phone } = req.body;

    db.query('DELETE FROM rickshaw WHERE driver_name= ? AND Phone=?',
        [driver_name, phone],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Rickshaw added successfully' });
        });
});

router.post('/contactUs', (req, res) => {
    console.log(req.body);
    const { user_name, email, subject, message } = req.body;

    db.query('INSERT INTO contactus (user_name, email, subject, message) VALUES (?, ?, ?, ?)',
        [user_name, email, subject, message],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: 'Message sent successfully' });
        });
});

router.get('/fetchContactUs', (req, res) => {
    console.log("hi there");
    db.query('SELECT * FROM contactus', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        // Send the actual fetched data
        res.json(results); // OR { message: 'Fetched successfully', data: results }
    });
});
// Remove all contact submissions
router.post('/removeAllContactUs', (req, res) => {
    console.log("Remove All btn");
    db.query('TRUNCATE TABLE contactus', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "All contact submissions removed successfully", results });
    });
});

// Remove one contact submission by user_name and email
router.post('/removeOneContactUs', (req, res) => {
    const { user_name, email } = req.body;

    console.log("hi there");
    db.query('DELETE FROM contactus WHERE user_name = ? AND email = ?', [user_name, email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Contact submission removed successfully", results });
    });
});

router.post('/removeFeedback', (req, res) => {
    console.log(req.body);
    const { placename, user_name, user_comment } = req.body;

    db.query(
        `DELETE FROM ${placename}_feedback WHERE user_name = ? AND user_comment = ?`,
        [user_name, user_comment],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            if (results.affectedRows > 0) {
                res.json({
                    success: true,
                    message: 'Comment removed successfully',
                });
            } else {
                res.json({
                    success: false,
                    message: 'No comment matched the given details',
                });
            }
        }
    );
});

router.post('/removeUserFeedback', (req, res) => {
    console.log(req.body);
    const { email, placename } = req.body;

    db.query(
        `DELETE FROM ${placename}_feedback WHERE email = ?`,
        [email],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            if (results.affectedRows > 0) {
                res.json({
                    success: true,
                    message: 'Comment removed successfully',
                });
            } else {
                res.json({
                    success: false,
                    message: 'No comment matched the given details',
                });
            }
        }
    );
});

router.post('/removeReply', (req, res) => {
    console.log(req.body);
    const { placename, email, replier_comment, feedback_user_name } = req.body;

    db.query(
        `DELETE FROM ${placename}_replies WHERE email = ? AND feedback_user_name = ? AND replier_comment = ?`,
        [email, feedback_user_name, replier_comment],
        (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            if (results.affectedRows > 0) {
                res.json({
                    success: true,
                    message: 'Reply removed successfully',
                });
            } else {
                res.json({
                    success: false,
                    message: 'No reply matched the given details',
                });
            }
        }
    );
});

router.get("/publicToilets", (req, res) => {
    const query = "SELECT name, lat, lng FROM public_toilets";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(200).json(results); // always nice to set status explicitly
    });
});

router.post("/addPublicToilets", (req, res) => {
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

router.post("/removePublicToilets", (req, res) => {
    const { name } = req.body;

    // ✅ Validate incoming data
    if (!name) {
        return res.status(400).json({ error: "Missing required fields: name, lat, or lng" });
    }

    const query = "DELETE FROM public_toilets WHERE name = ?";

    db.query(query, [name], (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "No matching toilet found to remove." });
        }

        res.status(200).json({
            message: "Toilet location removed successfully",
            affectedRows: results.affectedRows,
        });
    });
});



module.exports = router;
