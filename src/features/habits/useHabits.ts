import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { recentDateKeys, toDateKey } from "../../lib/dates";
import type { Habit, HabitCompletion } from "../../types/domain";
import { useAuth } from "../auth/AuthProvider";

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyHabitId, setBusyHabitId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    const fromDate = recentDateKeys(42)[0];
    const [habitsResult, completionsResult] = await Promise.all([
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
        .gte("completed_date", fromDate),
    ]);

    if (habitsResult.error || completionsResult.error) {
      setError(habitsResult.error?.message || completionsResult.error?.message || "Could not load habits");
    } else {
      setHabits(habitsResult.data ?? []);
      setCompletions(completionsResult.data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const completedToday = useMemo(() => {
    const today = toDateKey();
    return new Set(
      completions
        .filter((completion) => completion.completed_date === today)
        .map((completion) => completion.habit_id),
    );
  }, [completions]);

  const createHabit = async (values: { title: string; color: string; cadence: string }) => {
    if (!user) return;
    const { error: createError } = await supabase.from("habits").insert({
      user_id: user.id,
      title: values.title,
      color: values.color,
      cadence: values.cadence,
      icon: "circle",
      sort_order: habits.length,
    });
    if (createError) throw createError;
    await load();
  };

  const updateHabit = async (habitId: string, values: { title: string; color: string; cadence: string }) => {
    const { error: updateError } = await supabase
      .from("habits")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", habitId);
    if (updateError) throw updateError;
    await load();
  };

  const archiveHabit = async (habitId: string) => {
    const { error: archiveError } = await supabase
      .from("habits")
      .update({ is_archived: true, updated_at: new Date().toISOString() })
      .eq("id", habitId);
    if (archiveError) throw archiveError;
    await load();
  };

  const toggleHabit = async (habit: Habit, completed: boolean, date = toDateKey()) => {
    if (!user) return;
    setBusyHabitId(habit.id);
    const previous = completions;
    const optimisticCompletion: HabitCompletion = {
      id: `optimistic-${habit.id}-${date}`,
      user_id: user.id,
      habit_id: habit.id,
      completed_date: date,
      completed_at: new Date().toISOString(),
      xp_awarded: 10,
    };

    setCompletions((current) =>
      completed
        ? [...current.filter((item) => !(item.habit_id === habit.id && item.completed_date === date)), optimisticCompletion]
        : current.filter((item) => !(item.habit_id === habit.id && item.completed_date === date)),
    );

    const { error: invokeError } = await supabase.functions.invoke("toggle-habit", {
      body: { habitId: habit.id, date, completed },
    });

    if (invokeError) {
      setCompletions(previous);
      setError(invokeError.message);
    } else {
      await load();
    }

    setBusyHabitId(null);
  };

  return {
    habits,
    completions,
    completedToday,
    loading,
    error,
    busyHabitId,
    createHabit,
    updateHabit,
    archiveHabit,
    toggleHabit,
    reload: load,
  };
}

