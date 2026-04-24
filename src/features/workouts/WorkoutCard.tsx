import { Dumbbell } from "lucide-react";
import type { WorkoutWithExercises } from "../../types/domain";

type WorkoutCardProps = {
  workout: WorkoutWithExercises;
};

export function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
          <Dumbbell className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-sm font-semibold text-ink-950">{workout.type}</h3>
            <span className="shrink-0 rounded-full bg-paper-100 px-2 py-1 text-xs font-semibold text-ink-600">
              +{workout.xp_awarded} XP
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-500">
            {workout.duration_minutes ? `${workout.duration_minutes} min` : "Quick log"}
          </p>
          {workout.exercise_entries.length ? (
            <div className="mt-3 space-y-1">
              {workout.exercise_entries.map((exercise) => (
                <p className="text-sm text-ink-600" key={exercise.id}>
                  {exercise.name}: {exercise.sets} x {exercise.reps}
                  {exercise.weight ? ` at ${exercise.weight}${exercise.unit ?? ""}` : ""}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
