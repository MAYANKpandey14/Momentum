import { clsx } from "clsx";
import { recentDateKeys } from "../../lib/dates";
import type { DailyScore, HabitCompletion } from "../../types/domain";

type HeatmapCalendarProps = {
  completions?: HabitCompletion[];
  scores?: DailyScore[];
};

export function HeatmapCalendar({ completions = [], scores = [] }: HeatmapCalendarProps) {
  const days = recentDateKeys(35);

  const intensityFor = (date: string) => {
    const score = scores.find((item) => item.score_date === date);
    if (score) return Math.min(4, Math.ceil(score.completion_percent / 25));
    return Math.min(4, completions.filter((item) => item.completed_date === date).length);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10">
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date) => {
          const intensity = intensityFor(date);
          return (
            <div
              aria-label={`${date}: ${intensity} activity level`}
              className={clsx(
                "aspect-square rounded-[4px]",
                intensity === 0 && "bg-paper-200",
                intensity === 1 && "bg-moss-500/25",
                intensity === 2 && "bg-moss-500/50",
                intensity === 3 && "bg-moss-500/70",
                intensity >= 4 && "bg-moss-600",
              )}
              key={date}
              title={date}
            />
          );
        })}
      </div>
    </div>
  );
}
