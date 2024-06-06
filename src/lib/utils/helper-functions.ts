export function percent(number: number, percentage: number) {
  return (number * percentage) / 100;
}

export function hoursToMilliseconds(hours: number) {
  return hours * 60 * 60 * 1000;
}

export function minutesToMilliseconds(minutes: number) {
  return minutes * 60 * 1000;
}
