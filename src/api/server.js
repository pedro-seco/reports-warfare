require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

const router = require('./routes/reports');
app.use('/api/reports', router);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});