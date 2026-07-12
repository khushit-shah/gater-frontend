import React, { Component } from "react";
import { MathJax } from "better-react-mathjax";

export default class Question extends Component {
  constructor(props) {
    super(props);
    this.state = { editingIndex: false, draftIndex: "" };
    this.indexInputRef = React.createRef();
  }

  startEditing() {
    this.setState({ editingIndex: true, draftIndex: String(this.props.currentIndex + 1) }, () => {
      if (this.indexInputRef.current) {
        this.indexInputRef.current.select();
      }
    });
  }

  commitEdit() {
    if (!this.state.editingIndex) return;
    const { totalQuestions, onJumpToIndex } = this.props;
    const parsed = parseInt(this.state.draftIndex, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalQuestions) {
      onJumpToIndex(parsed - 1);
    }
    this.setState({ editingIndex: false, draftIndex: "" });
  }

  cancelEdit() {
    this.setState({ editingIndex: false, draftIndex: "" });
  }

  render() {
    const { question, listName, currentIndex, totalQuestions, onPrevious, onNext, onTrackEvent } =
      this.props;
    const tags = question.tags || [];
    const body = question.question || "";

    return (
      <div>
        <div className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="h-1 bg-sky-500" />
          <div className="space-y-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Browsing
                </p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {listName}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {this.state.editingIndex ? (
                  <input
                    ref={this.indexInputRef}
                    type="number"
                    min={1}
                    max={totalQuestions}
                    value={this.state.draftIndex}
                    onChange={(e) => this.setState({ draftIndex: e.target.value })}
                    onBlur={() => this.commitEdit()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); this.commitEdit(); }
                      if (e.key === "Escape") { e.preventDefault(); this.cancelEdit(); }
                    }}
                    className="w-14 rounded border border-sky-400 bg-white px-1 py-0 text-center text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400/50 dark:border-sky-500 dark:bg-slate-800 dark:text-slate-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                ) : (
                  <button
                    title="Click to jump to a question number"
                    onClick={() => totalQuestions > 0 && this.startEditing()}
                    className="rounded px-1 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
                  >
                    {totalQuestions > 0 ? currentIndex + 1 : 0}
                  </button>
                )}
                <span>/ {totalQuestions}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 md:text-3xl">
                {question.title}
              </h2>
              <MathJax
                dynamic="true"
                className="overflow-auto whitespace-normal text-lg leading-8 text-slate-600 dark:text-slate-300 md:text-xl"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: body
                      .replace(/\n\n/g, "<br />")
                      .replace(/\n<li>/g, "<br><li>"),
                  }}
                ></div>
              </MathJax>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={() => {
                  onTrackEvent?.("question_previous_button_click", {
                    question_id: question?.id ?? "",
                  });
                  onPrevious();
                }}
                disabled={totalQuestions <= 1}
              >
                Previous
              </button>
              <button
                className="rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                onClick={() => {
                  onTrackEvent?.("question_next_button_click", {
                    question_id: question?.id ?? "",
                  });
                  onNext();
                }}
                disabled={totalQuestions <= 1}
              >
                Next
              </button>
              {question.link && (
                <button
                  className="rounded-full bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-500/20 dark:bg-sky-500 dark:hover:bg-sky-400"
                  onClick={() => {
                    onTrackEvent?.("question_solution_click", {
                      question_id: question?.id ?? "",
                    });
                    window.open(question.link, "_blank");
                  }}
                >
                  Solution
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
