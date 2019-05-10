const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/errorHandler');
const scraper = require('./scraper/scraper');
const db = require('./db/db');
// const db = require('./helpers/db')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// ==== api routes ====
app.use('/schedule', require('./schedule/schedule.controller'));
app.use('/users', require('./users/user.controller'));

// global error handler
app.use(errorHandler);

/*
app.get('/', async function (req, res) {
    scraper.getData('https://buchung.hsz.rwth-aachen.de/angebote/Sommersemester_2019/_Volleyball_Spielbetrieb.html')
    .then((x) => res.json(x));
});*/

// TODO: serve frontend files at production runtime


// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

process.on('SIGTERM', () => {
    db.close();
});