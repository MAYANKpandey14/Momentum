import { FormEvent, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import type { JournalEntry } from "../../types/domain";

type JournalEditorProps = {
  entry: JournalEntry | null;
  onSave: (values: { content: string; mood: string | null; tags: string[] }) => Promise<void>;
};

const prompts = [
  "What made today feel lighter?",
  "What is worth remembering?",
  "What would make tomorrow easier?",
];

const moods = ["calm", "steady", "tired", "bright"];

export function JournalEditor({ entry, onSave }: JournalEditorProps) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | null>("steady");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setContent(entry?.content ?? "");
    setMood(entry?.mood ?? "steady");
    setTags(entry?.tags?.join(", ") ?? "");
  }, [entry]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    setBusy(true);
    await onSave({
      content: content.trim(),
      mood,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    setBusy(false);
  };

  return (
    <form className="space-y-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-ink-950/10" onSubmit={submit}>
      <div className="rounded-lg bg-paper-100 p-3 text-sm font-medium text-ink-600">
        {prompts[new Date().getDate() % prompts.length]}
      </div>

      <textarea
        className="min-h-40 w-full resize-none rounded-lg border border-ink-950/10 bg-paper-50 px-3 py-3 leading-6 outline-none transition focus:border-coral-400"
        onChange={(event) => setContent(event.target.value)}
        placeholder="A few honest lines..."
        value={content}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">Mood</p>
        <div className="grid grid-cols-4 gap-2">
          {moods.map((item) => (
            <button
              className={`h-10 rounded-lg text-sm font-semibold transition ${
                mood === item ? "bg-coral-400 text-white" : "bg-paper-100 text-ink-600 hover:bg-paper-200"
              }`}
              key={item}
              onClick={() => setMood(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-sm font-medium text-ink-800">
        Tags
        <input
          className="mt-1 h-11 w-full rounded-lg border border-ink-950/10 bg-paper-50 px-3 outline-none transition focus:border-coral-400"
          onChange={(event) => setTags(event.target.value)}
          placeholder="sleep, training, work"
          value={tags}
        />
      </label>

      <Button className="w-full" disabled={busy} type="submit">
        {busy ? "Saving..." : entry ? "Update reflection" : "Save reflection"}
      </Button>
    </form>
  );
}
