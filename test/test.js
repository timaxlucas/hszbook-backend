const db = require('../db/db');
const sc = require('../modules/schedule/schedule.service');
const moment = require('moment');


describe('scheduleService', () => {

  test('invalid time check', async() => {
    expect.assertions(1);

    try {
      await sc.createSchedule({
        date: moment().format(),
        kid: '1234567',
        link: '//',
      }, {
        user: 'test@example.de',
        roles: []
      });
    } catch (e) {
      expect(e).toMatch(/invalid date/);
    }
  }, 10 * 1000);

  test('admin multiple register', async() => {
    expect.assertions(0);

    const link = 'demolink';
    const kid = '13131823';
    const data = { firstname: 'John' };
    const id1 = await sc.createSchedule({
      date: moment().add(1, 'months').format(),
      kid,
      link,
      ...data
    }, {
      user: 'adminuser',
      roles: ['admin']
    });
    const id2 = await sc.createSchedule({
      date: moment().add(1, 'months').format(),
      kid,
      link,
      ...data
    }, {
      user: 'adminuser',
      roles: ['admin']
    });

    await sc.cancelSchedule({ id: id1 }, { user: 'adminuser', roles: [] });
    await sc.cancelSchedule({ id: id2 }, { user: 'adminuser', roles: [] });
  });

  test('register and delete', async() => {
    expect.assertions(4);

    const link = 'https://buchung.hsz.rwth-aachen.de/angebote/Sommersemester_2019/_Basketball_Spielbetrieb.html';
    const kid = '13131823';
    const data = {
      firstname: 'John',
      surname: 'Schnee',
      gender: 'male',
      street: 'moo street 13',
      city: '12345 city',
      matrnr: '123456',
      email: 'asd.fgh@rwth-aachen.de',
      phone: '0123456789',
      iban: 'DE12 3456 7891 0123 4567 89'
    };
    const id = await sc.createSchedule({
      date: moment().add(1, 'minutes').format(),
      kid,
      link,
      ...data
    }, {
      user: 'testuser',
      roles: []
    });

    const res = await sc.listSchedules({}, { user: 'testuser' }, false);
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe(id);

    try {
      await sc.createSchedule({
        date: moment().add(1, 'minutes').format(),
        kid,
        link,
        ...data
      }, {
        user: 'testuser',
        roles: []
      });
    } catch (e) {
      expect(e).toMatch('You already scheduled a registration for this course!');
    }

    try {
      await sc.cancelSchedule({ id }, { user: 'somehobo', roles: [] });
    } catch (e) {
      expect(e).toMatch('you are not allowed to cancel others schedules');
    }

    await sc.cancelSchedule({ id }, { user: 'testuser', roles: [] });

  }, 5 * 1000);
});


afterAll(() => {
  db.close();
});
