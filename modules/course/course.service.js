
const { CronJob } = require('cron');
const { getData } = require('hszbook');
const { getSports } = require('../../db/db');
const rxjs = require('rxjs');
const logger = require('../../helpers/logger');

// const courseSubject = new rxjs.BehaviorSubject({});
const sports = [];

new CronJob('*/20 * * * *', async function() {
  await updateSportData();
}, null, true, 'Europe/Berlin');

module.exports = {
  listCourses,
  listSports
};

async function listCourses({ sport }) {
  const res = sports.find(x => x.value.sport === sport);
  if (res === undefined)
    throw 'sport not found';
  return res.value;
}

async function listSports() {
  const res = (await getSports()).rows;
  const l = [];
  for (const r of res)
    l.push(r.name);
  return l;
}

async function loadSports(loadSportData = false) {
  const res = (await getSports()).rows;
  res.forEach(r => {
    const subject = new rxjs.BehaviorSubject({
      sport: r.name,
      timestamp: Date.now(),
      data: [],
      link: r.link
    });
    sports.push(subject);
  });
  logger.debug(`Loaded ${sports.length} sports from database`, { source: 'course' });

  if (loadSportData)
    updateSportData();
}

async function updateSportData() {
  for (const c of sports) {
    const data = await getData(c.value.link);
    c.next({
      sport: c.value.sport,
      timestamp: Date.now(),
      data: data,
      link: c.value.link
    });
    logger.debug(`updated course data for sport ${c.value.sport}`, { source: 'course' });
  }
}

loadSports(true);
