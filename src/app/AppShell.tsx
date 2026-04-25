import { useState, type ReactNode } from "react";
import { LogOut } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../features/auth/AuthProvider";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const { signOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
            onClick={() => setIsLogoutModalOpen(true)}
            type="button"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>
        {children}
      </div>
      <BottomNav />
      <Modal
        title="Sign Out"
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <p className="mb-6 text-ink-600">Are you sure you want to sign out of Momentum?</p>
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={() => setIsLogoutModalOpen(false)}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={signOut}
            variant="danger"
          >
            Sign out
          </Button>
        </div>
      </Modal>
    </div>
  );
}
