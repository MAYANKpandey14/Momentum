import { Check, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import type { Habit } from "../../types/domain";

type HabitCardProps = {
  habit: Habit;
  completed: boolean;
  busy?: boolean;
  onToggle: (completed: boolean) => void;
  onEdit?: () => void;
};

export function HabitCard({ habit, completed, busy, onToggle, onEdit }: HabitCardProps) {
  return (
    <motion.div
      animate={{ opacity: completed ? 0.76 : 1, scale: completed ? 0.992 : 1 }}
      className="flex min-h-16 items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-ink-950/10"
      layout
      transition={{ duration: 0.16 }}
    >
      <button
        aria-label={completed ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition",
          completed
            ? "border-moss-500 bg-moss-500 text-white"
            : "border-ink-950/10 bg-paper-50 text-ink-400",
        )}
        disabled={busy}
        onClick={() => onToggle(!completed)}
        type="button"
      >
        <Check className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className={clsx("truncate text-sm font-semibold", completed ? "text-ink-600 line-through" : "text-ink-950")}>
          {habit.title}
        </p>
        <p className="text-xs font-medium text-ink-400">{habit.cadence}</p>
      </div>
      {onEdit ? (
        <button
          aria-label={`Edit ${habit.title}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-400 transition hover:bg-paper-100 hover:text-ink-800"
          onClick={onEdit}
          type="button"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      ) : null}
    </motion.div>
  );
}
