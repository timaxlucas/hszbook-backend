
const { CronJob } = require('cron');
const { getData } = require('../../../hszbook');
const rxjs = require('rxjs');
const logger = require('../../helpers/logger');

const courseSubject = new rxjs.BehaviorSubject();
courseSubject.next([{}]);

var courseJob = new CronJob("*/5 * * * *", async function () {
    await updateCourseData();
}, null, true, "Europe/Berlin");

module.exports = {
    listCourses
};

async function listCourses() {
    let res = courseSubject.value;
    return res;
}

async function updateCourseData() {
    let data = await getData('https://buchung.hsz.rwth-aachen.de/angebote/Sommersemester_2019/_Volleyball_Spielbetrieb.html');
    courseSubject.next({
        timestamp: Date.now(),
        data: data
    });
    logger.debug(`updated course data`, { source: 'course' });
}

updateCourseData();
