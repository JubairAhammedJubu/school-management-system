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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-700"
    >
      <Pencil className="h-3.5 w-3.5" />
      Enter Results
    </button>
  );
}