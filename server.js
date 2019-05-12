const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/errorHandler');
const scraper = require('./scraper/scraper');
const db = require('./db/db');
const authorize = require('./helpers/authorize');
// const db = require('./helpers/db')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// ==== api routes ====
app.use('/schedule', authorize(), require('./schedule/schedule.controller'));
app.use('/users', require('./users/user.controller'));
app.use('/course',  authorize(), require('./course/course.controller'));


// global error handler
app.use(errorHandler);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
}
// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

process.on('SIGTERM', () => {
    db.close();
});