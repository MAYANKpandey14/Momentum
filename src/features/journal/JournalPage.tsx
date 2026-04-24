import { NotebookPen } from "lucide-react";
import { EmptyState } from "../../components/EmptyState";
import { LoadingState } from "../../components/LoadingState";
import { SectionHeader } from "../../components/SectionHeader";
import { friendlyDate } from "../../lib/dates";
import { JournalEditor } from "./JournalEditor";
import { useJournal } from "./useJournal";

export function JournalPage() {
  const { entries, error, loading, saveEntry, todayEntry } = useJournal();

  return (
    <main className="space-y-6">
      <section>
        <SectionHeader title="Today's reflection" />
        <JournalEditor entry={todayEntry} onSave={saveEntry} />
      </section>

      <section>
        <SectionHeader title="Recent entries" />
        {error ? <p className="mb-3 rounded-lg bg-coral-400/10 p-3 text-sm text-coral-500">{error}</p> : null}
        {loading ? (
          <LoadingState />
        ) : entries.length === 0 ? (
          <EmptyState
            copy="The first entry can be tiny. Momentum cares that you arrived."
            icon={<NotebookPen className="h-5 w-5" />}
            title="No reflections yet"
          />
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10" key={entry.id}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-ink-950">{friendlyDate(entry.entry_date)}</h3>
                  {entry.mood ? (
                    <span className="rounded-full bg-coral-400/10 px-2 py-1 text-xs font-semibold text-coral-500">
                      {entry.mood}
                    </span>
                  ) : null}
                </div>
                <p className="line-clamp-3 text-sm leading-6 text-ink-600">{entry.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
