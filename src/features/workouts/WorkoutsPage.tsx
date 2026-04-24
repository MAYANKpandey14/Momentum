import { Dumbbell } from "lucide-react";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { SectionHeader } from "../../components/SectionHeader";
import { WorkoutCard } from "./WorkoutCard";
import { WorkoutLogger } from "./WorkoutLogger";
import { useWorkouts } from "./useWorkouts";

export function WorkoutsPage() {
  const { error, loading, saveWorkout, workouts } = useWorkouts();

  return (
    <main className="space-y-6">
      <section>
        <SectionHeader title="Fast log" />
        <WorkoutLogger onSave={saveWorkout} />
      </section>

      <section>
        <SectionHeader title="Recent workouts" />
        {error ? <p className="mb-3 rounded-lg bg-coral-400/10 p-3 text-sm text-coral-500">{error}</p> : null}
        {loading ? (
          <LoadingState />
        ) : workouts.length === 0 ? (
          <EmptyState
            copy="Log the simplest version first. Details can stay light."
            icon={<Dumbbell className="h-5 w-5" />}
            title="No workouts yet"
          />
        ) : (
          <div className="space-y-2">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
