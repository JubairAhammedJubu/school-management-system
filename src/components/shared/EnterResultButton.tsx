"use client";

import { Pencil } from "lucide-react";

type EnterResultButtonProps = {
  onClick: () => void;
};

export default function EnterResultButton({
  onClick,
}: EnterResultButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 cursor-pointer shrink-0 z-10"
    >
      <Pencil className="h-4 w-4" />
      Enter Results
    </button>
  );
}