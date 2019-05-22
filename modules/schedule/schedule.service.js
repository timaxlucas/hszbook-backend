
const { CronJob } = require('cron');
const scraper = require('../scraper/scraper');
const moment = require('moment');
const db = require('../../db/db');
const logger = require('../../helpers/logger');
const { forEach } = require('async-foreach');
const jobs = [];

module.exports = {
  createSchedule,
  listSchedules,
  cancelSchedule
};


// load schedules from database 
(async () => {
  let res = await db.getSchedule();
  forEach(res.rows, (r) => {
    createSchedule({ date: r.date, kid: r.kid, link: r.link, ...r.data}, { user: r.user }, false);
  });
  logger.info(`Loaded ${res.rowCount} schedule(s) from database`, { source: 'schedule' })
})()


async function createSchedule({ date, kid, link, ...data }, { user }, uploadToDB = true) {
  
  const time = moment(new Date(date));

  // only one registration per event & user
  if (jobs.find((e) => e.kid == kid && e.user == user)) {
    throw 'You already scheduled a registration for this course!';
  }
  if (date == 0) {
    scraper.registerForKid(link, kid, data);
    return;
  }
  if (time.isBefore(Date.now() + 1000 * 20)) {
    throw `invalid date: date is ${time.fromNow()}`;
  }

  // upload to DB
  if (uploadToDB) {
    await db.uploadSchedule({ user, date, kid, link, data });
  }

  const job = new CronJob(time, async () => {
    // delete job from jobqueue
    jobs.splice(jobs.indexOf(this), 1);

    // delete job from database
    await db.removeSchedule({ user, kid });

    // start register process
    await scraper.registerForKid(link, kid, data);
  }, null, false, "Europe/Berlin");
  job.start();
  jobs.push({ job, data, user, kid, link });
}

async function cancelSchedule({ user: userToCancel, kid }, { user, roles }) {
  let job = jobs.find((d) => d.kid == kid && d.user == userToCancel);
  if (!job) {
    throw 'schedule not found';
  }
  if (job.user != user && roles.indexOf("admin") == -1) {
    throw 'you are not allowed to cancel others schedules'
  }
  // delete job from database
  await db.removeSchedule({ user: userToCancel, kid });
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


