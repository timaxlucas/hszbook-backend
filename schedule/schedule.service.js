
const { CronJob, CronTime } = require('cron');
const scraper = require('../scraper/scraper');
const moment = require('moment');
const db = require('../db/db');
const jobs = [];

module.exports = {
  createSchedule,
  listSchedules,
  cancelSchedule
};

// TODO LOAD JOBS FROM DATABASE

async function startJob(date, kid, link, data, user) {
  const time = moment(new Date(date));
  if (time.isBefore(Date.now() + 1000 * 20)) {
    throw `invalid date: date is ${time.fromNow()}`;
  }

  const job = new CronJob(time, async () => {
    // delete job from jobqueue
    jobs.splice(jobs.indexOf(this), 1);

    // delete job from database
    // TODO

    // start register process
    await scraper.registerForKid(link, kid, data);
  }, null, false, "Europe/Berlin");
  job.start();
  jobs.push({ job, data, user, kid, link });
}

async function createSchedule({ date, kid, link, ...data }, { user }) {
  // only one registration per event & user
  if (jobs.find((e) => e.kid == kid && e.user == user)) {
    throw 'You already scheduled a registration for this course!';
  }
  if (date == 0) {
    scraper.registerForKid(link, kid, data);
    return;
  }
  // at least 20sec difference

  // upload to DB

  // start job
  await startJob(date, kid, link, data, user);
}

async function cancelSchedule({ user: userToCancel, kid }, { user, roles }) {
  let job = jobs.find((d) => d.kid == kid && d.user == userToCancel);
  if (!job) {
    throw 'schedule not found';
  }
  if (job.user != user && roles.indexOf("admin") == -1) {
    throw 'you are not allowed to cancel others schedules'
  }
  job.job.stop();
  jobs.splice(jobs.indexOf(job), 1);
}

async function listSchedules({}, { user }, all) {
  let res = jobs;
  if (!all) {
    res = res.filter(j => j.user == user);
  }
  return res.map(j => {
    return {
      kid: j.kid,
      running: j.job.running,
      link: j.link,
      date: j.job.nextDate(),
      user: j.user,
      data: j.data
    }
  })
}


