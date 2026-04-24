import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  copy: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, copy, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-ink-950/15 bg-white/60 p-5 text-center">
      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-paper-200 text-ink-600">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-ink-950">{title}</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-ink-600">{copy}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

