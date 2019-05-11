
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
  let link = req.body.link;
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
  // modify it for users
  if (jobs.find((e) => e.kid == kid)) {
    throw 'already schedule with kid running';
  }
  try {
    // at least 20sec difference
    const job = new CronJob(new Date(date), async function () {
      // TODO start to exec registerPhase
      jobs.splice(jobs.indexOf(this), 1);
      await scraper.registerForKid(link, kid, data);
      // remove from job queue
      //jobs.splice(jobs.indexOf(this), 1);
    }, null, false, "Europe/Berlin");
    job.start();
    jobs.push({
      job: job,
      data: data,
      kid: kid,
      link: link,
    });
  } catch(e) {
    throw 'invalid date'
  }
}

async function listSchedules() {
  return jobs.map(j => {
    return {
      kid: j.kid,
      running: j.job.running,
      link: j.link,
      date: j.job.nextDate(),
      email: "test@example.de",
      data: j.data
    }
  })
}


