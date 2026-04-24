import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import type { Habit } from "../../types/domain";

type HabitFormProps = {
  habit?: Habit | null;
  onSubmit: (values: { title: string; color: string; cadence: string }) => Promise<void>;
  onArchive?: () => Promise<void>;
};

const colors = ["moss", "coral", "sky", "saffron"];

export function HabitForm({ habit, onArchive, onSubmit }: HabitFormProps) {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("moss");
  const [cadence, setCadence] = useState("daily");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setTitle(habit?.title ?? "");
    setColor(habit?.color ?? "moss");
    setCadence(habit?.cadence ?? "daily");
  }, [habit]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    await onSubmit({ title: title.trim(), color, cadence });
    setBusy(false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      <label className="block text-sm font-medium text-ink-800">
        Habit
        <input
          className="mt-1 h-12 w-full rounded-lg border border-ink-950/10 bg-white px-3 outline-none transition focus:border-moss-500"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Drink water"
          value={title}
        />
      </label>

      <label className="block text-sm font-medium text-ink-800">
        Rhythm
        <select
          className="mt-1 h-12 w-full rounded-lg border border-ink-950/10 bg-white px-3 outline-none transition focus:border-moss-500"
          onChange={(event) => setCadence(event.target.value)}
          value={cadence}
        >
          <option value="daily">Daily</option>
          <option value="weekdays">Weekdays</option>
          <option value="training days">Training days</option>
        </select>
      </label>

      <div>
        <p className="text-sm font-medium text-ink-800">Color</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {colors.map((item) => (
            <button
              aria-label={`${item} color`}
              className={`h-11 rounded-lg ring-2 ring-offset-2 ring-offset-paper-50 transition ${
                color === item ? "ring-ink-950" : "ring-transparent"
              } ${
                item === "moss"
                  ? "bg-moss-500"
                  : item === "coral"
                    ? "bg-coral-400"
                    : item === "sky"
                      ? "bg-sky-500"
                      : "bg-saffron-400"
              }`}
              key={item}
              onClick={() => setColor(item)}
              type="button"
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {habit && onArchive ? (
          <Button className="flex-1" disabled={busy} onClick={onArchive} variant="danger">
            Archive
          </Button>
        ) : null}
        <Button className="flex-1" disabled={busy} type="submit">
          {busy ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

