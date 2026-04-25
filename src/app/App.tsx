import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { lazy, Suspense } from "react";
import { AuthPage } from "../features/auth/AuthPage";
import { AuthProvider, useAuth } from "../features/auth/AuthProvider";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { AppShell } from "./AppShell";

const HabitsPage = lazy(() => import("../features/habits/HabitsPage").then((m) => ({ default: m.HabitsPage })));
const JournalPage = lazy(() => import("../features/journal/JournalPage").then((m) => ({ default: m.JournalPage })));
const ProgressPage = lazy(() => import("../features/progress/ProgressPage").then((m) => ({ default: m.ProgressPage })));
const WorkoutsPage = lazy(() => import("../features/workouts/WorkoutsPage").then((m) => ({ default: m.WorkoutsPage })));

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
      <Suspense fallback={<div className="flex justify-center p-8 text-ink-400">Loading...</div>}>
        <Routes>
          <Route element={<DashboardPage />} path="/" />
          <Route element={<HabitsPage />} path="/habits" />
          <Route element={<WorkoutsPage />} path="/workouts" />
          <Route element={<JournalPage />} path="/journal" />
          <Route element={<ProgressPage />} path="/progress" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </Suspense>
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

