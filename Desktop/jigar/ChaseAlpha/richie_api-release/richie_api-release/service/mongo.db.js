const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;

// connect to the database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// get the connection object
const conn = mongoose.connection;

module.exports = conn;
