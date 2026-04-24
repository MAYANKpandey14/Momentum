import { Award, BarChart3, Flame } from "lucide-react";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { ProgressRing } from "../../components/ProgressRing";
import { SectionHeader } from "../../components/SectionHeader";
import { AchievementBadge } from "../gamification/AchievementBadge";
import { HeatmapCalendar } from "../habits/HeatmapCalendar";
import { useProgress } from "./useProgress";

export function ProgressPage() {
  const { achievements, error, loading, scores, week } = useProgress();

  if (loading) return <LoadingState />;

  return (
    <main className="space-y-6">
      {error ? <p className="rounded-lg bg-coral-400/10 p-3 text-sm text-coral-500">{error}</p> : null}

      <section className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-ink-950/10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-600">This week</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink-950">{week.showedUp}/7 days</h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              {week.xp} XP earned with {week.averageCompletion}% average completion.
            </p>
          </div>
          <ProgressRing label="avg" size={112} value={week.averageCompletion} />
        </div>
      </section>

      <section>
        <SectionHeader title="Activity heatmap" />
        <HeatmapCalendar scores={scores} />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10">
          <BarChart3 className="mb-3 h-5 w-5 text-sky-500" />
          <p className="text-2xl font-semibold text-ink-950">{scores.length}</p>
          <p className="text-sm text-ink-600">tracked days</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10">
          <Flame className="mb-3 h-5 w-5 text-coral-500" />
          <p className="text-2xl font-semibold text-ink-950">
            {Math.max(0, ...scores.map((score) => score.streak_count))}
          </p>
          <p className="text-sm text-ink-600">best streak</p>
        </div>
      </section>

      <section>
        <SectionHeader title="Achievements" />
        {achievements.length === 0 ? (
          <EmptyState
            copy="Badges unlock as habits, workouts, and reflections stack up."
            icon={<Award className="h-5 w-5" />}
            title="Nothing unlocked yet"
          />
        ) : (
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <AchievementBadge achievement={achievement} key={achievement.id} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
