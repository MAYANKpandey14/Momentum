import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toDateKey } from "../../lib/dates";
import type { JournalEntry } from "../../types/domain";
import { useAuth } from "../auth/AuthProvider";

export function useJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    const [entriesResult, todayResult] = await Promise.all([
      supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(20),
      supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .eq("entry_date", toDateKey())
        .maybeSingle(),
    ]);

    if (entriesResult.error || todayResult.error) {
      setError(entriesResult.error?.message || todayResult.error?.message || "Could not load journal");
    } else {
      setEntries(entriesResult.data ?? []);
      setTodayEntry(todayResult.data ?? null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveEntry = async (values: { content: string; mood: string | null; tags: string[] }) => {
    const { error: invokeError } = await supabase.functions.invoke("save-journal", {
      body: { date: toDateKey(), ...values },
    });
    if (invokeError) {
      setError(invokeError.message);
      throw invokeError;
    }
    await load();
  };

  return { entries, todayEntry, loading, error, saveEntry, reload: load };
}

