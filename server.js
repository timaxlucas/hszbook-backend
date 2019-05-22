const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const logger = require('./helpers/logger');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/errorHandler');
const scraper = require('./modules/scraper/scraper');
const db = require('./db/db');
const authorize = require('./helpers/authorize');
// const db = require('./helpers/db')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// ==== api routes ====
app.use('/schedule', authorize(), require('./modules/schedule/schedule.controller'));
app.use('/users', require('./modules/users/user.controller'));
app.use('/course',  authorize(), require('./modules/course/course.controller'));


// global error handler
app.use(errorHandler);





// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    logger.info('Server listening on port ' + port, { source: 'init' });
});

process.on('SIGTERM', () => {
    db.close();
});