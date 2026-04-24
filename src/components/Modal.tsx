import type { ReactNode } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/25 px-3 pb-3 backdrop-blur-sm sm:items-center">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl bg-paper-50 p-4 shadow-soft ring-1 ring-ink-950/10"
        initial={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-950">{title}</h2>
          <button
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 transition hover:bg-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.section>
    </div>
  );
}
