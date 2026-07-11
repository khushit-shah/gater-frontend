import React, { Component } from "react";
import { MathJax } from "better-react-mathjax";

export default class Question extends Component {
  render() {
    const { question, listName, currentIndex, totalQuestions, onPrevious, onNext } = this.props;
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
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {totalQuestions > 0 ? `${currentIndex + 1} / ${totalQuestions}` : "0 / 0"}
              </p>
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
                onClick={onPrevious}
                disabled={totalQuestions <= 1}
              >
                Previous
              </button>
              <button
                className="rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                onClick={onNext}
                disabled={totalQuestions <= 1}
              >
                Next
              </button>
              {question.link && (
                <button
                  className="rounded-full bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-500/20 dark:bg-sky-500 dark:hover:bg-sky-400"
                  onClick={() => {
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
