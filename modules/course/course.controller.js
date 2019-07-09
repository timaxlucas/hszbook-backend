const express = require('express');
const router = express.Router();
const courseService = require('./course.service');

// routes
router.get('/:sport', listCourses);
router.get('/', listSports);

module.exports = router;


function listCourses(req, res, next) {
  courseService.listCourses({ sport: req.params.sport })
      .then(x => res.json(x))
      .catch(err => next(err));
}

function listSports(req, res, next) {
  courseService.listSports()
      .then(x => res.json(x))
      .catch(err => next(err));
}
