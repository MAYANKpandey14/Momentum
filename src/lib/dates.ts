import {
  addDays,
  eachDayOfInterval,
  format,
  isToday,
  parseISO,
  startOfWeek,
  subDays,
} from "date-fns";

export const toDateKey = (date: Date = new Date()) => format(date, "yyyy-MM-dd");

export const friendlyDate = (dateKey: string) => {
  const date = parseISO(dateKey);
  return isToday(date) ? "Today" : format(date, "EEE, MMM d");
};

export const greetingForNow = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const recentDateKeys = (count: number) => {
  const today = new Date();
  return eachDayOfInterval({
    start: subDays(today, count - 1),
    end: today,
  }).map(toDateKey);
};

export const currentWeekDateKeys = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end: addDays(start, 6) }).map(toDateKey);
};

