import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiCheck, FiRefreshCw, FiX } from "react-icons/fi";

export default function ListEditorModal({
  isOpen,
  mode,
  listName,
  defaultName,
  currentFilterTags,
  currentQuestionIds,
  onCancel,
  onSubmit,
}) {
  const [name, setName] = useState(defaultName || "");
  const [useCurrentFilters, setUseCurrentFilters] = useState(true);
  const inputRef = useRef(null);

  const hasCurrentFilters = currentFilterTags.length > 0 && currentQuestionIds.length > 0;
  const title = mode === "edit" ? "Edit saved list" : "Name your list";
  const description =
    mode === "edit"
      ? "Rename the list and optionally replace its questions with the filters you have selected now."
      : "Choose a name before saving the questions from your current filters.";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(defaultName || "");
    setUseCurrentFilters(mode === "edit" ? hasCurrentFilters : true);

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select?.();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [defaultName, hasCurrentFilters, isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  const selectedFilterPreview = useMemo(() => {
    if (currentFilterTags.length === 0) {
      return "No filters selected.";
    }

    const preview = currentFilterTags.slice(0, 5).map((tag) => `#${tag}`).join(" · ");
    return currentFilterTags.length > 5 ? `${preview} · +${currentFilterTags.length - 5} more` : preview;
  }, [currentFilterTags]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name,
      useCurrentFilters,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="list-editor-title"
      aria-describedby="list-editor-description"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-label="Close dialog"
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_40px_100px_-35px_rgba(15,23,42,0.65)] dark:border-slate-800 dark:bg-slate-950">
        <div className="bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500 px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                {mode === "edit" ? "Update list" : "Create list"}
              </p>
              <h2 id="list-editor-title" className="mt-2 text-2xl font-semibold">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <p id="list-editor-description" className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            {description}
          </p>

          <div className="space-y-2">
            <label htmlFor="list-name" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              List name
            </label>
            <input
              ref={inputRef}
              id="list-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. GATE 2024 Algorithms"
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:bg-slate-950 dark:focus:ring-sky-400/10"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Current filters
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {currentFilterTags.length > 0
                    ? `${currentQuestionIds.length} questions match the selected filters.`
                    : "Select filters first to replace the list contents."}
                </p>
              </div>
              {mode === "edit" && (
                <label className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={useCurrentFilters}
                    onChange={(event) => setUseCurrentFilters(event.target.checked)}
                    disabled={!hasCurrentFilters}
                    className="h-4 w-4 accent-sky-500 disabled:cursor-not-allowed"
                  />
                  Replace with current filters
                </label>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {currentFilterTags.length === 0 ? (
                <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  None selected
                </span>
              ) : (
                currentFilterTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  >
                    #{tag}
                  </span>
                ))
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {selectedFilterPreview}
            </p>

            {mode === "edit" && listName && (
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Current saved list: <span className="font-semibold text-slate-700 dark:text-slate-200">{listName}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
            >
              {mode === "edit" ? <FiRefreshCw className="h-4 w-4" /> : <FiCheck className="h-4 w-4" />}
              {mode === "edit" ? "Update list" : "Create list"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
