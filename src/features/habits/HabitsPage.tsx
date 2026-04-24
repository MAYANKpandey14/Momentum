import { useState } from "react";
import { Plus, Repeat2 } from "lucide-react";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { Modal } from "../../components/Modal";
import { SectionHeader } from "../../components/SectionHeader";
import type { Habit } from "../../types/domain";
import { HabitCard } from "./HabitCard";
import { HabitForm } from "./HabitForm";
import { HeatmapCalendar } from "./HeatmapCalendar";
import { useHabits } from "./useHabits";

export function HabitsPage() {
  const {
    archiveHabit,
    busyHabitId,
    completedToday,
    completions,
    createHabit,
    error,
    habits,
    loading,
    toggleHabit,
    updateHabit,
  } = useHabits();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <main className="space-y-6">
      <section>
        <SectionHeader
          action={
            <Button
              className="h-10 min-h-10 px-3"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setModalOpen(true)}
            >
              Add
            </Button>
          }
          title="Habits"
        />
        {error ? <p className="mb-3 rounded-lg bg-coral-400/10 p-3 text-sm text-coral-500">{error}</p> : null}
        {loading ? (
          <LoadingState />
        ) : habits.length === 0 ? (
          <EmptyState
            action={<Button onClick={() => setModalOpen(true)}>Create habit</Button>}
            copy="Start with one repeatable action that makes the day feel steadier."
            icon={<Repeat2 className="h-5 w-5" />}
            title="No habits yet"
          />
        ) : (
          <div className="space-y-2">
            {habits.map((habit) => (
              <HabitCard
                busy={busyHabitId === habit.id}
                completed={completedToday.has(habit.id)}
                habit={habit}
                key={habit.id}
                onEdit={() => {
                  setEditing(habit);
                  setModalOpen(true);
                }}
                onToggle={(completed) => toggleHabit(habit, completed)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader title="Consistency" />
        <HeatmapCalendar completions={completions} />
      </section>

      <Modal open={modalOpen} title={editing ? "Edit habit" : "New habit"} onClose={closeModal}>
        <HabitForm
          habit={editing}
          onArchive={
            editing
              ? async () => {
                  await archiveHabit(editing.id);
                  closeModal();
                }
              : undefined
          }
          onSubmit={async (values) => {
            if (editing) {
              await updateHabit(editing.id, values);
            } else {
              await createHabit(values);
            }
            closeModal();
          }}
        />
      </Modal>
    </main>
  );
}
