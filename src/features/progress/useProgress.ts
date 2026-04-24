import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { currentWeekDateKeys, recentDateKeys } from "../../lib/dates";
import { totalXp } from "../../lib/scoring";
import type { Achievement, DailyScore } from "../../types/domain";
import { useAuth } from "../auth/AuthProvider";

export function useProgress() {
  const { user } = useAuth();
  const [scores, setScores] = useState<DailyScore[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    const fromDate = recentDateKeys(42)[0];
    const [scoresResult, achievementsResult] = await Promise.all([
      supabase
        .from("daily_scores")
        .select("*")
        .eq("user_id", user.id)
        .gte("score_date", fromDate)
        .order("score_date", { ascending: true }),
      supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false }),
    ]);

    if (scoresResult.error || achievementsResult.error) {
      setError(scoresResult.error?.message || achievementsResult.error?.message || "Could not load progress");
    } else {
      setScores(scoresResult.data ?? []);
      setAchievements(achievementsResult.data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const week = useMemo(() => {
    const days = currentWeekDateKeys();
    const weekScores = scores.filter((score) => days.includes(score.score_date));
    const showedUp = weekScores.filter((score) => score.completion_percent > 0).length;
    const averageCompletion = weekScores.length
      ? Math.round(weekScores.reduce((sum, score) => sum + score.completion_percent, 0) / weekScores.length)
      : 0;
    return {
      showedUp,
      averageCompletion,
      xp: totalXp(weekScores),
    };
  }, [scores]);

  return { achievements, error, loading, scores, week };
}

