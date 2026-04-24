import { Award } from "lucide-react";
import type { Achievement } from "../../types/domain";

type AchievementBadgeProps = {
  achievement?: Achievement;
  title?: string;
  locked?: boolean;
};

export function AchievementBadge({ achievement, title, locked }: AchievementBadgeProps) {
  return (
    <div className="flex min-h-16 items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-ink-950/10">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-saffron-400/20 text-saffron-400">
        <Award className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink-950">
          {achievement?.title ?? title}
        </p>
        <p className="truncate text-xs text-ink-600">
          {locked ? "Waiting for the right day" : achievement?.description}
        </p>
      </div>
    </div>
  );
}
