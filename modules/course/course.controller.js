const express = require('express');
const router = express.Router();
const courseService = require('./course.service');
const bs = require('rxjs').BehaviorSubject;

// routes
router.get('/', listCourses);

module.exports = router;


function listCourses(req, res, next) {
    courseService.listCourses()
        .then(x => res.json(x))
        .catch(err => next(err));
}
