const express = require('express');
const router = express.Router();
const scheduleService = require('./schedule.service');

// routes
router.post('/', createSchedule);
router.get('/', listSchedules);

module.exports = router;

function createSchedule(req, res, next) {
    scheduleService.createSchedule(req)
        .then(x => res.json(x))
        .catch(err => next(err));
}

function listSchedules(req, res, next) {
    scheduleService.listSchedules()
        .then(x => res.json(x))
        .catch(err => next(err));
}
