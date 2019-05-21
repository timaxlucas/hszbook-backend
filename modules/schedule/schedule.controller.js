const express = require('express');
const router = express.Router();
const scheduleService = require('./schedule.service');
const authorize = require("../../helpers/authorize");

// routes
router.post('/', createSchedule);
router.post('/cancel', cancelSchedule);
router.get('/', listMySchedules);
router.get('/all', authorize("admin"), listAllSchedules);

module.exports = router;

function createSchedule(req, res, next) {
    scheduleService.createSchedule(req.body, req.user)
        .then(x => res.json(x))
        .catch(err => next(err));
}

function listMySchedules(req, res, next) {
    scheduleService.listSchedules(req.body, req.user, false)
        .then(x => res.json(x))
        .catch(err => next(err));
}

function listAllSchedules(req, res, next) {
    scheduleService.listSchedules(req.body, req.user, true)
        .then(x => res.json(x))
        .catch(err => next(err));
}

function cancelSchedule(req, res, next) {
    scheduleService.cancelSchedule(req.body, req.user)
        .then(x => res.json(x))
        .catch(err => next(err));
}
