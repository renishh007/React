const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
}

connectDB();

const transactions = require('./routes/transactions');

const app = express();

app.use(express.json());
app.use(cors());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/transactions', transactions);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('Client/build'));

    // This is for local production testing; Vercel will use vercel.json for routing
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'Client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

// Only listen locally, Vercel exports the app
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
}

module.exports = app;