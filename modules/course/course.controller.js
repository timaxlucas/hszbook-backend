const express = require('express');
const router = express.Router();
const courseService = require('./course.service');

// routes
router.get('/', listCourses);

module.exports = router;


function listCourses(req, res, next) {
  courseService.listCourses()
      .then(x => res.json(x))
      .catch(err => next(err));
}
