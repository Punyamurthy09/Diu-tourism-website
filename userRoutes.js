const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {  // Corrected path
    res.send('Get all users');
});

router.get('/:id', (req, res) => {  // Corrected path
    res.send(`Get user with ID: ${req.params.id}`);
});

module.exports = router;