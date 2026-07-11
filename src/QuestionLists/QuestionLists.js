import React from "react";
import { FiEdit3, FiTrash2, FiList } from "react-icons/fi";

export default function QuestionLists({
  activeList,
  activeListId,
  filterTags,
  filteredCount,
  savedLists,
  onSelectList,
  onDeleteList,
  onEditList,
}) {
  const hasFilters = filterTags.length > 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Question Lists
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Build a list, then browse only that list
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                All questions
              </span>{" "}
              is the global list. Save filtered lists from the filter section, then use the list
              selector to move through only those questions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-6 py-5 md:grid-cols-1 md:px-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onSelectList("all")}
              className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                activeListId === "all"
                  ? "border-sky-500 bg-sky-50 text-sky-950 dark:border-sky-400 dark:bg-sky-500/10 dark:text-sky-100"
                  : "border-slate-300 bg-slate-50 text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-sky-500/50 dark:hover:bg-slate-800"
              }`}
            >
              <span>
                <span className="block text-sm font-semibold">All questions</span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  Global question bank
                </span>
              </span>
              <FiList className="h-4 w-4" />
            </button>

            {savedLists.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                No saved lists yet. Apply filters and save one.
              </div>
            ) : (
              savedLists.map((list) => {
                const isActive = activeListId === list.id;
                return (
                  <div
                    key={list.id}
                    className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-4 transition ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-50"
                        : "border-slate-300 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-emerald-500/50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelectList(list.id)}
                      className="flex-1 text-left"
                    >
                      <span className="block text-sm font-semibold">{list.name}</span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        {list.questionIds.length} questions
                      </span>
                      {list.sourceTags?.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                          {list.sourceTags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex w-fit items-center rounded-full border border-slate-300 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditList?.(list)}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-sky-600 dark:hover:bg-slate-800"
                        aria-label={`Edit ${list.name}`}
                        title={`Edit ${list.name}`}
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteList(list.id)}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-white hover:text-rose-600 dark:hover:bg-slate-800"
                        aria-label={`Delete ${list.name}`}
                        title={`Delete ${list.name}`}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Filter preview
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {hasFilters
                ? `${filteredCount} questions match the current filter set.`
                : "No filters selected. Add year or topic tags to preview a smaller list."}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Selected filters
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {filterTags.length === 0 ? (
                <span className="rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  None
                </span>
              ) : (
                filterTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    #{tag}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
