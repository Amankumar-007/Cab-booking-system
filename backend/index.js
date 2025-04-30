const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const userRoutes = require('./routes/user.route');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.use('/api/users', userRoutes);

module.exports = app;
