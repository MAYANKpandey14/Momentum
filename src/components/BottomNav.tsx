import { BarChart3, Dumbbell, Home, NotebookPen, Repeat2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

const items = [
  { to: "/", label: "Today", icon: Home },
  { to: "/habits", label: "Habits", icon: Repeat2 },
  { to: "/workouts", label: "Train", icon: Dumbbell },
  { to: "/journal", label: "Journal", icon: NotebookPen },
  { to: "/progress", label: "Progress", icon: BarChart3 },
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-950/10 bg-paper-50/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl md:left-1/2 md:max-w-md md:-translate-x-1/2 md:rounded-t-2xl md:border-x">
      <div className="grid grid-cols-5 gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            aria-label={label}
            className={({ isActive }) =>
              clsx(
                "flex h-14 flex-col items-center justify-center rounded-lg text-[0.68rem] font-medium transition",
                isActive
                  ? "bg-white text-ink-950 shadow-sm ring-1 ring-ink-950/10"
                  : "text-ink-600 hover:bg-white/70",
              )
            }
            to={to}
          >
            <Icon className="mb-1 h-5 w-5" strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
