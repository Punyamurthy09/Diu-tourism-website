const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/rickshaw', (req, res) => {
    db.query('SELECT * FROM rickshaw', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get('/statebus', (req, res) => {
    db.query('SELECT * FROM state_buses', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get('/localbus', (req, res) => {
    db.query('SELECT * FROM local_buses order by bus_time', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get('/flight', (req, res) => {

    db.query('SELECT * FROM flights', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

module.exports = router;
