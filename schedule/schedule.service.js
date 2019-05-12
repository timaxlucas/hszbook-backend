
const CronJob = require('cron').CronJob;
const scraper = require('../scraper/scraper');
const db = require('../db/db');
var jobs = [];

module.exports = {
  createSchedule,
  listSchedules,
  cancelSchedule
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
  if (jobs.find((e) => e.kid == kid && e.email == req.user.email)) {
    throw 'already schedule with kid running';
  }
  if (date == 0) {
    scraper.registerForKid(link, kid, data);
    return;
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
      email: req.user.email,
      kid: kid,
      link: link,
    });
  } catch(e) {
    throw 'invalid date'
  }
}

async function cancelSchedule(req) {
  let email = req.body.email;
  let kid = req.body.kid;
  let job = jobs.find((d) => d.kid == kid && d.email == email);
  if (!job) {
    throw 'schedule not found';
  }
  if (req.user.roles.indexOf("admin") == -1 && job.email != req.user.email) {
    throw 'you are not allowed to cancel others schedules'
  }
  job.job.stop();
  jobs.splice(jobs.indexOf(job), 1);
}

async function listSchedules(req, all) {
  let res = jobs;
  if (!all) {
    res = res.filter(j => j.email == req.user.email);
  }
  return res.map(j => {
    return {
      kid: j.kid,
      running: j.job.running,
      link: j.link,
      date: j.job.nextDate(),
      email: j.email,
      data: j.data
    }
  })
}


