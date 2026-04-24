import { useCallback, useEffect, useState } from "react";
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
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");

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
      setError(firstError.message);
      setLoading(false);
      return;
    }

    const habits = habitsResult.data ?? [];
    const completions = completionsResult.data ?? [];
    const workouts = workoutsResult.data ?? [];
    const journal = journalResult.data ?? null;
    const score = scoreResult.data ?? computeFallbackDailyScore(date, habits, completions, workouts, journal);

    setData({
      habits,
      completions,
      workouts,
      journal,
      score,
      achievements: achievementsResult.data ?? [],
    });
    setLoading(false);
  }, [date, user]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, error, loading, reload: load };
}

