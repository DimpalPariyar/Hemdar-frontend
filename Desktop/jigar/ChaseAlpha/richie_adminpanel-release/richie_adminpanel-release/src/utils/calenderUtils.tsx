import dayjs from 'dayjs';

export function getMonth(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 7)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(6).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export function getWeek(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  let currentMonthCount = 0;
  let firstHour = dayjs(new Date(year, month, 7, 0)).hour();

  const WeekMatrix = new Array(6).fill([]).map(() => {
    return new Array(7).fill([]).map(() => {
      currentMonthCount++;
      return Array(24)
        .fill(null)
        .map(() => {
          firstHour++;
          return dayjs(new Date(year, 0, currentMonthCount, firstHour));
        });
    });
  });
  return WeekMatrix;
}
