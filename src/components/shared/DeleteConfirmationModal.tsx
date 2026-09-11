"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Loader2, X } from "lucide-react";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  itemTitle?: string;
  confirmButtonText?: string;
  isDeleting?: boolean;
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Record",
  itemTitle = "this item",
  confirmButtonText = "Delete",
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex min-h-full items-center justify-center p-3.5 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={isDeleting ? undefined : onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              {/* Icon Container */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-2xs">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    &quot;{itemTitle}&quot;
                  </span>
                  ? This action cannot be undone and will permanently remove this record from the system.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="h-9.5 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="inline-flex h-9.5 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-rose-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    {confirmButtonText}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
