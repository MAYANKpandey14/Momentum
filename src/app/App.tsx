import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthPage } from "../features/auth/AuthPage";
import { AuthProvider, useAuth } from "../features/auth/AuthProvider";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { HabitsPage } from "../features/habits/HabitsPage";
import { JournalPage } from "../features/journal/JournalPage";
import { ProgressPage } from "../features/progress/ProgressPage";
import { WorkoutsPage } from "../features/workouts/WorkoutsPage";
import { AppShell } from "./AppShell";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function ProtectedApp() {
  const { isConfigured, loading, session } = useAuth();

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 text-sm text-ink-600">
        Warming up your day...
      </main>
    );
  }

  if (!isConfigured || !session) {
    return <AuthPage />;
  }

  return (
    <AppShell>
      <Routes>
        <Route element={<DashboardPage />} path="/" />
        <Route element={<HabitsPage />} path="/habits" />
        <Route element={<WorkoutsPage />} path="/workouts" />
        <Route element={<JournalPage />} path="/journal" />
        <Route element={<ProgressPage />} path="/progress" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </AppShell>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ProtectedApp />
          <Toaster position="bottom-center" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

