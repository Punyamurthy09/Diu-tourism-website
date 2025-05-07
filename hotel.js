const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {

    db.query('SELECT * FROM hotels', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


router.post('/', (req, res) => {
    const { from_location, to_location, flight_time, flight_name } = req.body;
    if (!from_location || !to_location || !flight_time || !flight_name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('INSERT INTO flights (from_location, to_location, flight_time, flight_name) VALUES (?, ?, ?, ?)',
        [from_location, to_location, flight_time, flight_name],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Flight added successfully', flightId: result.insertId });
        });
});

module.exports = router;

