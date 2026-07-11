import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { QuestionService } from "../QuestionService";

const MARK_OPTIONS = [
  { value: "1-mark", label: "1 mark" },
  { value: "2-marks", label: "2 marks" },
  { value: "no-mark", label: "No mark tag" },
];

const QUESTION_TYPE_OPTIONS = [
  { value: "normal", label: "MCQ / single-select" },
  { value: "multiple-selects", label: "Multiple select" },
  { value: "numerical-answers", label: "Numerical answer" },
  { value: "fill-in-the-blanks", label: "Fill in the blanks" },
  { value: "output", label: "Output" },
  { value: "no-question-type", label: "No question type" },
];

const TOPIC_OPTIONS = [{ value: "no-topic", label: "No topic tags" }];

const FilterTags = (props) => {
  const tags = QuestionService.getTags();
  const [selectedTags, setSelectedTags1] = useState([]);
  const [value, setValue] = useState("");
  const [isMyInputFocused, setIsMyInputFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsMyInputFocused(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMyInputFocused(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const setSelectedTags = (nextSelectedTags) => {
    setSelectedTags1(nextSelectedTags);
    props.tagsSelected(nextSelectedTags);
  };

  const toggleTag = (option) => {
    if (selectedTags.includes(option)) {
      setSelectedTags(selectedTags.filter((tag) => tag !== option));
    } else {
      setSelectedTags([...selectedTags, option]);
    }
  };

  const query = value.trim().toLowerCase();
  const matchesQuery = (text) => text.toLowerCase().includes(query);

  const gateTags = tags.filter((option) => QuestionService.isYearTag(option) && matchesQuery(option));
  const topicTags = tags.filter(
    (option) =>
      !QuestionService.isYearTag(option) &&
      !QuestionService.isMarkTag(option) &&
      !QuestionService.isQuestionTypeTag(option) &&
      !QuestionService.isTopicAbsenceTag(option) &&
      matchesQuery(option)
  );
  const markTags = MARK_OPTIONS.filter(
    (option) => matchesQuery(option.value) || matchesQuery(option.label)
  );
  const questionTypeTags = QUESTION_TYPE_OPTIONS.filter(
    (option) => matchesQuery(option.value) || matchesQuery(option.label)
  );
  const noTopicTags = TOPIC_OPTIONS.filter(
    (option) => matchesQuery(option.value) || matchesQuery(option.label)
  );
  const totalResults =
    gateTags.length + markTags.length + questionTypeTags.length + topicTags.length + noTopicTags.length;

  const renderOptionList = ({
    title,
    emptyText,
    options,
    buttonClassName,
    accentClassName,
    compact = false,
  }) => (
    <div
      className={`self-start rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 ${accentClassName}`}
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <ul className={compact ? "flex flex-wrap gap-2" : "space-y-2"}>
        {options.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-slate-400 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {emptyText}
          </li>
        ) : (
          options.map((option) => (
            <li key={option.value ?? option} className={compact ? "flex-1 min-w-[140px]" : ""}>
              <label className={buttonClassName}>
                <span className="pr-3">
                  <input
                    type="checkbox"
                    id={option.value ?? option}
                    checked={selectedTags.includes(option.value ?? option)}
                    onChange={() => toggleTag(option.value ?? option)}
                    className="mr-3 accent-sky-500"
                  />
                  {option.label ?? option}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {QuestionService.getCount(option.value ?? option)}
                </span>
              </label>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="rounded-3xl border border-slate-300 bg-white p-5 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
        <label
          htmlFor="filter"
          className="mb-3 block text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400"
        >
          Filter
        </label>
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            onFocus={() => setIsMyInputFocused(true)}
            type="text"
            id="filter"
            className="block w-full rounded-2xl border border-slate-400 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:bg-slate-900 dark:focus:ring-sky-400/10"
            placeholder="Search papers, marks, types, or topics"
            required
            list="tags"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {selectedTags.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-400 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  onClick={() => toggleTag(option)}
                >
                  <span>#{option.replace(/-/g, " ")}</span>
                  <span className="text-slate-400 dark:text-slate-500">×</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={props.onSaveFilteredList}
            disabled={!props.canSaveFilteredList}
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-sky-500 dark:hover:bg-sky-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            Save filtered list
          </button>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create a persistent list from the currently selected filters.
          </p>
        </div>
      </div>

      {isMyInputFocused && (
        <div className="absolute left-0 right-0 top-full z-20 mt-3 overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-[0_28px_70px_-30px_rgba(15,23,42,0.45)] ring-1 ring-black/5 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-300 px-5 py-4 dark:border-slate-800">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Suggestions
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Click outside or press Esc to close.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {totalResults} results
            </div>
          </div>

          <div className="grid max-h-[70vh] items-start gap-4 overflow-auto p-5 md:grid-cols-2">
            {renderOptionList({
              title: "Marks",
              emptyText: "No mark filters match your search.",
              options: markTags,
              buttonClassName:
                "inline-flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-300 px-4 py-2.5 text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-500/50 dark:hover:bg-slate-800",
              accentClassName: "md:col-span-1",
              compact: true,
            })}
            {renderOptionList({
              title: "Question type",
              emptyText: "No question types match your search.",
              options: questionTypeTags,
              buttonClassName:
                "flex cursor-pointer items-center justify-between rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-violet-500/50 dark:hover:bg-slate-800",
              accentClassName: "md:col-span-1",
            })}
            {renderOptionList({
              title: "Paper",
              emptyText: "No papers match your search.",
              options: gateTags,
              buttonClassName:
                "flex cursor-pointer items-center justify-between rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-sky-500/50 dark:hover:bg-slate-800",
              accentClassName: "md:col-span-1",
            })}
            {renderOptionList({
              title: "Topics",
              emptyText: "No topics match your search.",
              options: [...TOPIC_OPTIONS, ...topicTags],
              buttonClassName:
                "flex cursor-pointer items-center justify-between rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-500/50 dark:hover:bg-slate-800",
              accentClassName: "md:col-span-1",
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterTags;
