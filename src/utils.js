function pad(i) {
  return `${i < 10 ? '0' : ''}${i}`;
}

export function getDateTimeString(
  time = new Date().toISOString(),
  timezoneOffset = new Date().getTimezoneOffset(),
) {
  const date = new Date(new Date(time).getTime() + (timezoneOffset * 60 * 1000));
  const offsetHours = Math.abs(Math.floor(timezoneOffset / 60));
  const offsetMinutes = Math.abs(timezoneOffset % 60);
  return date.toISOString().replace('Z', `${timezoneOffset >= 0 ? '+' : '-'}${pad(offsetHours)}:${pad(offsetMinutes)}`);
}