const moment = require('moment');

const addMinutesToDate = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

const getHoursLater = (hours = 0) => {
  return moment().add(hours, 'hours').toDate();
};

module.exports = {
  addMinutesToDate,
  getHoursLater,
};
