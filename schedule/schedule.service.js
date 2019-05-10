
const CronJob = require('cron').CronJob;
const scraper = require('../scraper/scraper');
const db = require('../db/db');
var jobs = [];

var historyJob = new CronJob("*/5 * * * *", async function () {
  console.log("uploading history");
  let x = await scraper.getData('https://buchung.hsz.rwth-aachen.de/angebote/Sommersemester_2019/_Volleyball_Spielbetrieb.html');
  await db.uploadHistory(x);
}, null, true, "Europe/Berlin");

module.exports = {
  createSchedule,
  listSchedules
};

async function createSchedule(req) {
  let date = req.body.date;
  let kid = req.body.kid;
  let data = {
    firstname: req.body.firstname,
    surname: req.body.surname,
    street: req.body.street,
    city: req.body.city,
    matrnr: req.body.matrnr,
    email: req.body.email,
    phone: req.body.phone,
    iban: req.body.iban
  };
  try {
    // at least 20sec difference
    const job = new CronJob(new Date(date), async function () {
      // TODO start to exec registerPhase
      jobs.splice(jobs.indexOf(this), 1);
      await scraper.registerForKid(kid, data);
      // remove from job queue
      //jobs.splice(jobs.indexOf(this), 1);
    }, null, false, "Europe/Berlin");
    job.kid = kid;
    job.start();
    jobs.push(job);
  } catch(e) {
    throw 'invalid date'
  }
}

async function listSchedules() {
  return jobs.map(job => {
    return {
      running: job.running,
      kid: job.kid,
      next: job.nextDate()
    }
  })
}


