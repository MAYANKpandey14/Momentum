import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../features/auth/AuthProvider";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-paper-100 text-ink-800">
      <div className="mx-auto min-h-screen max-w-md bg-paper-50 px-4 pb-28 pt-[calc(env(safe-area-inset-top)+1rem)] shadow-soft sm:my-4 sm:rounded-3xl sm:ring-1 sm:ring-ink-950/10">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Momentum</p>
            <h1 className="text-xl font-semibold text-ink-950">Daily rhythm</h1>
          </div>
          <button
            aria-label="Sign out"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-ink-600 shadow-sm ring-1 ring-ink-950/10 transition hover:text-ink-950"
            onClick={signOut}
            type="button"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
