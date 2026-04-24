import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toDateKey } from "../../lib/dates";
import type { ExerciseInput, WorkoutWithExercises } from "../../types/domain";
import { useAuth } from "../auth/AuthProvider";

export function useWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("workouts")
      .select("*, exercise_entries(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (loadError) {
      setError(loadError.message);
    } else {
      setWorkouts((data ?? []) as WorkoutWithExercises[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveWorkout = async (values: {
    type: string;
    durationMinutes: number | null;
    notes: string | null;
    exercises: ExerciseInput[];
  }) => {
    const { error: invokeError } = await supabase.functions.invoke("save-workout", {
      body: { date: toDateKey(), ...values },
    });
    if (invokeError) {
      setError(invokeError.message);
      throw invokeError;
    }
    await load();
  };

  return { workouts, loading, error, saveWorkout, reload: load };
}

