import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { toDateKey } from "../../lib/dates";
import { computeFallbackDailyScore } from "../../lib/scoring";
import type { Achievement, DailyScore, Habit, HabitCompletion, JournalEntry, Workout } from "../../types/domain";
import { useAuth } from "../auth/AuthProvider";

export type DashboardData = {
  habits: Habit[];
  completions: HabitCompletion[];
  workouts: Workout[];
  journal: JournalEntry | null;
  score: DailyScore;
  achievements: Achievement[];
};

export function useDashboard(date = toDateKey()) {
  const { user } = useAuth();

  const { data, isLoading, error, refetch } = useQuery<DashboardData>({
    queryKey: ["dashboard", date, user?.id],
    queryFn: async () => {
      if (!user) throw new Error("No user");
      const [habitsResult, completionsResult, workoutsResult, journalResult, scoreResult, achievementsResult] =
        await Promise.all([
          supabase
            .from("habits")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_archived", false)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true }),
          supabase
            .from("habit_completions")
            .select("*")
            .eq("user_id", user.id)
            .eq("completed_date", date),
          supabase
            .from("workouts")
            .select("*")
            .eq("user_id", user.id)
            .eq("workout_date", date)
            .order("created_at", { ascending: false }),
          supabase
            .from("journal_entries")
            .select("*")
            .eq("user_id", user.id)
            .eq("entry_date", date)
            .maybeSingle(),
          supabase
            .from("daily_scores")
            .select("*")
            .eq("user_id", user.id)
            .eq("score_date", date)
            .maybeSingle(),
          supabase
            .from("achievements")
            .select("*")
            .eq("user_id", user.id)
            .order("unlocked_at", { ascending: false })
            .limit(3),
        ]);

      const firstError =
        habitsResult.error ||
        completionsResult.error ||
        workoutsResult.error ||
        journalResult.error ||
        scoreResult.error ||
        achievementsResult.error;

      if (firstError) {
        throw new Error(firstError.message);
      }

      const habits = (habitsResult.data as Habit[]) ?? [];
      const completions = (completionsResult.data as HabitCompletion[]) ?? [];
      const workouts = (workoutsResult.data as Workout[]) ?? [];
      const journal = (journalResult.data as JournalEntry) ?? null;
      const score = (scoreResult.data as DailyScore) ?? computeFallbackDailyScore(date, habits, completions, workouts, journal);

      return {
        habits,
        completions,
        workouts,
        journal,
        score,
        achievements: (achievementsResult.data as Achievement[]) ?? [],
      };
    },
    enabled: !!user,
  });

  return { data, error: error?.message || "", loading: isLoading, reload: refetch };
}

