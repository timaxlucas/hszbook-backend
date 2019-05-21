
const CronJob = require('cron').CronJob;
const scraper = require('../scraper/scraper');
const db = require('../../db/db');
const rxjs = require('rxjs');
const moment = require('moment');

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
    let data = await scraper.getData('https://buchung.hsz.rwth-aachen.de/angebote/Sommersemester_2019/_Volleyball_Spielbetrieb.html');
    courseSubject.next({
        timestamp: Date.now(),
        data: data
    })
}

updateCourseData();
