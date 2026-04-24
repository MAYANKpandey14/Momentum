import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/Button";
import type { ExerciseInput } from "../../types/domain";

type WorkoutLoggerProps = {
  onSave: (values: {
    type: string;
    durationMinutes: number | null;
    notes: string | null;
    exercises: ExerciseInput[];
  }) => Promise<void>;
};

const defaultExercise = (): ExerciseInput => ({
  name: "",
  sets: 3,
  reps: 8,
  weight: null,
  unit: "kg",
});

export function WorkoutLogger({ onSave }: WorkoutLoggerProps) {
  const [type, setType] = useState("Strength");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState<ExerciseInput[]>([defaultExercise()]);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    await onSave({
      type,
      durationMinutes: durationMinutes ? Number(durationMinutes) : null,
      notes: notes.trim() || null,
      exercises: exercises
        .filter((exercise) => exercise.name.trim())
        .map((exercise) => ({
          ...exercise,
          name: exercise.name.trim(),
          sets: Number(exercise.sets) || 1,
          reps: Number(exercise.reps) || 1,
          weight: exercise.weight ? Number(exercise.weight) : null,
        })),
    });
    setBusy(false);
    setType("Strength");
    setDurationMinutes("");
    setNotes("");
    setExercises([defaultExercise()]);
  };

  const updateExercise = (index: number, patch: Partial<ExerciseInput>) => {
    setExercises((current) => current.map((exercise, itemIndex) => (itemIndex === index ? { ...exercise, ...patch } : exercise)));
  };

  return (
    <form className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10" onSubmit={submit}>
      <div className="grid grid-cols-[1fr_6rem] gap-2">
        <label className="block text-sm font-medium text-ink-800">
          Type
          <select
            className="mt-1 h-11 w-full rounded-lg border border-ink-950/10 bg-paper-50 px-3 outline-none focus:border-sky-500"
            onChange={(event) => setType(event.target.value)}
            value={type}
          >
            <option>Strength</option>
            <option>Cardio</option>
            <option>Mobility</option>
            <option>Sport</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-ink-800">
          Min
          <input
            className="mt-1 h-11 w-full rounded-lg border border-ink-950/10 bg-paper-50 px-3 outline-none focus:border-sky-500"
            min="1"
            onChange={(event) => setDurationMinutes(event.target.value)}
            type="number"
            value={durationMinutes}
          />
        </label>
      </div>

      <div className="space-y-2">
        {exercises.map((exercise, index) => (
          <div className="grid grid-cols-[1fr_3.2rem_3.2rem_3.8rem_2.5rem] gap-2" key={index}>
            <input
              aria-label="Exercise name"
              className="h-10 min-w-0 rounded-lg border border-ink-950/10 bg-paper-50 px-2 text-sm outline-none focus:border-sky-500"
              onChange={(event) => updateExercise(index, { name: event.target.value })}
              placeholder="Exercise"
              value={exercise.name}
            />
            <input
              aria-label="Sets"
              className="h-10 rounded-lg border border-ink-950/10 bg-paper-50 px-2 text-sm outline-none focus:border-sky-500"
              min="1"
              onChange={(event) => updateExercise(index, { sets: Number(event.target.value) })}
              type="number"
              value={exercise.sets}
            />
            <input
              aria-label="Reps"
              className="h-10 rounded-lg border border-ink-950/10 bg-paper-50 px-2 text-sm outline-none focus:border-sky-500"
              min="1"
              onChange={(event) => updateExercise(index, { reps: Number(event.target.value) })}
              type="number"
              value={exercise.reps}
            />
            <input
              aria-label="Weight"
              className="h-10 rounded-lg border border-ink-950/10 bg-paper-50 px-2 text-sm outline-none focus:border-sky-500"
              min="0"
              onChange={(event) => updateExercise(index, { weight: Number(event.target.value) })}
              type="number"
              value={exercise.weight ?? ""}
            />
            <button
              aria-label="Remove exercise"
              className="flex h-10 items-center justify-center rounded-lg text-ink-400 transition hover:bg-paper-100"
              onClick={() => setExercises((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <label className="block text-sm font-medium text-ink-800">
        Notes
        <textarea
          className="mt-1 min-h-20 w-full rounded-lg border border-ink-950/10 bg-paper-50 px-3 py-2 outline-none focus:border-sky-500"
          onChange={(event) => setNotes(event.target.value)}
          placeholder="How did it feel?"
          value={notes}
        />
      </label>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setExercises((current) => [...current, defaultExercise()])}
          variant="secondary"
        >
          Exercise
        </Button>
        <Button className="flex-1" disabled={busy} type="submit">
          {busy ? "Saving..." : "Log workout"}
        </Button>
      </div>
    </form>
  );
}
