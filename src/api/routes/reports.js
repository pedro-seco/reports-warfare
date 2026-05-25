const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/monsters', (req, res) => {
    res.send('Get all monsters');
});
router.get('/monsters/:id', (req, res) => {});
router.post('/monsters/create', (req, res) => {});
router.put('/monsters/edit/:id', (req, res) => {});
router.delete('/monsters/:id', (req, res) => {});