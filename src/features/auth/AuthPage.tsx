import { FormEvent, useState } from "react";
import { KeyRound, Mail, Settings } from "lucide-react";
import { Button } from "../../components/Button";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: displayName } },
          });

    if (result.error) {
      setMessage(result.error.message);
    } else if (mode === "signup" && !result.data.session) {
      setMessage("Check your inbox to confirm your email.");
    }

    setLoading(false);
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-paper-50 px-6 text-ink-800">
        <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-950/10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-paper-200 text-ink-600">
            <Settings className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-ink-950">Connect Supabase</h1>
          <p className="mt-2 text-sm leading-6 text-ink-600">
            Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`, then restart the dev server.
          </p>
          <div className="mt-5 rounded-lg bg-paper-100 p-3 text-xs leading-6 text-ink-600">
            Supabase Auth, Postgres, RLS, and Edge Functions are already wired into the app.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-paper-50 px-5 text-ink-800">
      <section className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-ink-950/10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">Momentum</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-950">Build today gently.</h1>
        <p className="mt-2 text-sm leading-6 text-ink-600">
          Habits, training, and reflection in one quiet daily space.
        </p>

        <form className="mt-6 space-y-3" onSubmit={submit}>
          {mode === "signup" ? (
            <label className="block text-sm font-medium text-ink-800">
              Name
              <input
                className="mt-1 h-12 w-full rounded-lg border border-ink-950/10 bg-paper-50 px-3 outline-none transition focus:border-moss-500"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Maya"
                value={displayName}
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-ink-800">
            Email
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                className="h-12 w-full rounded-lg border border-ink-950/10 bg-paper-50 pl-10 pr-3 outline-none transition focus:border-moss-500"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>
          </label>

          <label className="block text-sm font-medium text-ink-800">
            Password
            <div className="relative mt-1">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                className="h-12 w-full rounded-lg border border-ink-950/10 bg-paper-50 pl-10 pr-3 outline-none transition focus:border-moss-500"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                required
                type="password"
                value={password}
              />
            </div>
          </label>

          {message ? <p className="rounded-lg bg-paper-100 p-3 text-sm text-ink-600">{message}</p> : null}

          <Button className="w-full" disabled={loading} type="submit">
            {loading ? "One moment..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          className="mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 transition hover:bg-paper-100"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          type="button"
        >
          {mode === "signin" ? "Create a new account" : "Use an existing account"}
        </button>
      </section>
    </main>
  );
}

