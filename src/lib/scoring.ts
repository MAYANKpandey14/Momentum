import type { Achievement, DailyScore, Habit, HabitCompletion, JournalEntry, Workout } from "../types/domain";

export const XP = {
  habit: 10,
  workout: 25,
  journal: 15,
};

export const levelFromXp = (xp: number) => Math.floor(xp / 250) + 1;

export const levelProgress = (xp: number) => {
  const currentLevelStart = Math.floor(xp / 250) * 250;
  return Math.round(((xp - currentLevelStart) / 250) * 100);
};

export const computeFallbackDailyScore = (
  date: string,
  habits: Habit[],
  completions: HabitCompletion[],
  workouts: Workout[],
  journal: JournalEntry | null,
): DailyScore => {
  const completedHabits = completions.filter((item) => item.completed_date === date).length;
  const totalHabits = habits.filter((habit) => !habit.is_archived).length;
  const hasWorkout = workouts.some((workout) => workout.workout_date === date);
  const hasJournal = Boolean(journal?.content?.trim());
  const denominator = totalHabits + 2;
  const completedActions = completedHabits + (hasWorkout ? 1 : 0) + (hasJournal ? 1 : 0);

  return {
    id: "fallback",
    user_id: "",
    score_date: date,
    xp: completedHabits * XP.habit + (hasWorkout ? XP.workout : 0) + (hasJournal ? XP.journal : 0),
    completion_percent: denominator > 0 ? Math.round((completedActions / denominator) * 100) : 0,
    completed_habits: completedHabits,
    total_habits: totalHabits,
    has_workout: hasWorkout,
    has_journal: hasJournal,
    streak_count: 0,
    updated_at: new Date().toISOString(),
  };
};

export const totalXp = (scores: DailyScore[]) =>
  scores.reduce((sum, score) => sum + score.xp, 0);

export const hasAchievement = (achievements: Achievement[], key: string) =>
  achievements.some((achievement) => achievement.key === key);

