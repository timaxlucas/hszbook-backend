const db = require('../db/db');


describe('scheduleService', () => {
  test('abc', async() => {
    require('../modules/schedule/schedule.service');
    expect(true).toBe(true);
  }, 10 * 1000);
});


afterAll(() => {
  db.close();
});