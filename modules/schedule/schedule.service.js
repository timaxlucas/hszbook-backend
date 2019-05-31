
const { CronJob } = require('cron');
const { registerForCourse } = require('hszbook');
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


loadSchedules();

async function loadSchedules() {
  const res = await db.getSchedule();
  forEach(res.rows, r => {
    if (moment(new Date(r.date)).isBefore(Date.now())) {
      // already completed schedule
      jobs.push({
        id: r.id,
        date: r.date,
        job: null,
        data: r.data,
        user: r.user,
        kid: r.kid,
        link: r.link,
        result: r.result
      });
    } else {
      createSchedule({ date: r.date, kid: r.kid, link: r.link, ...r.data}, { user: r.user, roles: ['admin'] }, r.id);
    }
  });
  logger.info(`Loaded ${res.rowCount} schedule(s) from database`, { source: 'schedule' });
}


async function createSchedule({ date, kid, link, ...data }, { user, roles }, uploadID = 0) {

  const time = moment(new Date(date));

  // only one registration per event & user or admin
  if (jobs.find((e => e.kid === kid && e.user === user && moment(new Date(e.date)).isAfter(Date.now()))) && roles.indexOf('admin') === -1)
    throw 'You already scheduled a registration for this course!';

  if (date === 0 || date === '0') {
    registerForCourse(link, kid, data).catch(e => logger.error(e, { source: 'schedule' }));
    return;
  }
  if (time.isBefore(Date.now() + 1000 * 20))
    throw `invalid date: date is ${time.fromNow()}`;


  // upload to DB
  if (uploadID === 0)
    uploadID = await db.uploadSchedule({ user, date, kid, link, data });


  const job = new CronJob(time, async() => {
    const res = await registerForCourse(link, kid, data, true);

    // update results in job list
    const ind = jobs.findIndex(obj => obj.id === uploadID);
    jobs[ind].result = res;

    // update results in db
    await db.updateSchedule(uploadID, res);
  }, null, false, 'Europe/Berlin');
  job.start();
  jobs.push({
    id: uploadID,
    date,
    job,
    data,
    user,
    kid,
    link,
    result: null
  });
  return uploadID;
}

async function cancelSchedule({ id }, { user, roles }) {
  if (!id)
    throw 'no id specified';

  const job = jobs.find(d => d.id === parseInt(id, 10));
  if (!job)
    throw 'schedule not found';

  if (job.user !== user && roles.indexOf('admin') === -1)
    throw 'you are not allowed to cancel others schedules';

  // delete job from database
  await db.removeSchedule(id);
  if (job.job)
    job.job.stop();
  jobs.splice(jobs.indexOf(job), 1);
}

async function listSchedules({}, { user }, all) {
  let res = jobs;
  if (!all)
    res = res.filter(j => j.user === user);

  return res.map(j => {
    let running;
    try {
      running = j.job.running;
    } catch (e) {
      running = false;
    }

    return {
      id: j.id,
      result: j.result,
      kid: j.kid,
      running: running,
      link: j.link,
      date: j.date,
      user: j.user,
      data: j.data
    };
  });
}


