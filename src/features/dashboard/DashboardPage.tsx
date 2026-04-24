import { Link } from "react-router-dom";
import { ArrowRight, Dumbbell, NotebookPen, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { ProgressRing } from "../../components/ProgressRing";
import { SectionHeader } from "../../components/SectionHeader";
import { friendlyDate, greetingForNow, toDateKey } from "../../lib/dates";
import { levelFromXp, levelProgress } from "../../lib/scoring";
import { HabitCard } from "../habits/HabitCard";
import { useHabits } from "../habits/useHabits";
import { AchievementBadge } from "../gamification/AchievementBadge";
import { useDashboard } from "./useDashboard";

export function DashboardPage() {
  const today = toDateKey();
  const { data, error, loading, reload } = useDashboard(today);
  const { busyHabitId, completedToday, toggleHabit } = useHabits();

  if (loading || !data) {
    return <LoadingState />;
  }

  const totalXp = data.score.xp;
  const level = levelFromXp(totalXp);

  return (
    <main className="space-y-6">
      {error ? <p className="rounded-lg bg-coral-400/12 p-3 text-sm text-coral-500">{error}</p> : null}

      <section className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-950/10">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-600">{friendlyDate(today)}</p>
            <h2 className="mt-1 text-2xl font-semibold leading-tight text-ink-950">
              {greetingForNow()}, let&apos;s build momentum.
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-paper-100 p-2">
                <p className="text-lg font-semibold text-ink-950">{totalXp}</p>
                <p className="text-[0.68rem] font-medium text-ink-500">XP today</p>
              </div>
              <div className="rounded-lg bg-paper-100 p-2">
                <p className="text-lg font-semibold text-ink-950">{data.score.streak_count}</p>
                <p className="text-[0.68rem] font-medium text-ink-500">streak</p>
              </div>
              <div className="rounded-lg bg-paper-100 p-2">
                <p className="text-lg font-semibold text-ink-950">{level}</p>
                <p className="text-[0.68rem] font-medium text-ink-500">level</p>
              </div>
            </div>
          </div>
          <ProgressRing size={118} value={data.score.completion_percent} />
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-paper-200">
          <div className="h-full rounded-full bg-saffron-400 transition-all" style={{ width: `${levelProgress(totalXp)}%` }} />
        </div>
      </section>

      <section>
        <SectionHeader
          action={
            <Link className="text-sm font-semibold text-moss-600" to="/habits">
              Manage
            </Link>
          }
          title="Today's habits"
        />
        {data.habits.length === 0 ? (
          <EmptyState
            action={
              <Link to="/habits">
                <Button icon={<Plus className="h-4 w-4" />}>Add habit</Button>
              </Link>
            }
            copy="One small repeatable action is enough to make the dashboard yours."
            icon={<Sparkles className="h-5 w-5" />}
            title="Start a daily rhythm"
          />
        ) : (
          <div className="space-y-2">
            {data.habits.slice(0, 4).map((habit) => (
              <HabitCard
                busy={busyHabitId === habit.id}
                completed={completedToday.has(habit.id)}
                habit={habit}
                key={habit.id}
                onToggle={async (completed) => {
                  await toggleHabit(habit, completed);
                  await reload();
                }}
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-3">
        <motion.div
          className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10"
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
                <Dumbbell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-950">
                  {data.workouts.length ? `${data.workouts.length} workout logged` : "Log a workout"}
                </p>
                <p className="text-xs text-ink-600">+25 XP for showing up</p>
              </div>
            </div>
            <Link aria-label="Open workouts" to="/workouts">
              <ArrowRight className="h-5 w-5 text-ink-400" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10"
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-coral-400/20 text-coral-500">
                <NotebookPen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-950">
                  {data.journal ? "Reflection saved" : "Capture a thought"}
                </p>
                <p className="text-xs text-ink-600">A few lines counts</p>
              </div>
            </div>
            <Link aria-label="Open journal" to="/journal">
              <ArrowRight className="h-5 w-5 text-ink-400" />
            </Link>
          </div>
        </motion.div>
      </div>

      {data.achievements.length ? (
        <section>
          <SectionHeader title="Unlocked" />
          <div className="space-y-2">
            {data.achievements.map((achievement) => (
              <AchievementBadge achievement={achievement} key={achievement.id} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
