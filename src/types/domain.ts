import type { Database } from "./supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
export type HabitUpdate = Database["public"]["Tables"]["habits"]["Update"];
export type HabitCompletion = Database["public"]["Tables"]["habit_completions"]["Row"];
export type Workout = Database["public"]["Tables"]["workouts"]["Row"];
export type ExerciseEntry = Database["public"]["Tables"]["exercise_entries"]["Row"];
export type JournalEntry = Database["public"]["Tables"]["journal_entries"]["Row"];
export type DailyScore = Database["public"]["Tables"]["daily_scores"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];

export type ExerciseInput = {
  name: string;
  sets: number;
  reps: number;
  weight?: number | null;
  unit?: string | null;
};

export type WorkoutWithExercises = Workout & {
  exercise_entries: ExerciseEntry[];
};

