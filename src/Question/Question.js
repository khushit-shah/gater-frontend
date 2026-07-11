import React, { Component } from "react";
import { MathJax } from "better-react-mathjax";

export default class Question extends Component {
  render() {
    return (
      <div>
        <div className="overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="h-1 bg-sky-500" />
          <div className="space-y-5 p-6 md:p-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 md:text-3xl">
                {this.props.question.title}
              </h2>
              <MathJax
                dynamic="true"
                className="overflow-auto whitespace-normal text-lg leading-8 text-slate-600 dark:text-slate-300 md:text-xl"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.props.question.question
                      .replace(/\n\n/g, "<br />")
                      .replace(/\n<li>/g, "<br><li>"),
                  }}
                ></div>
              </MathJax>
            </div>

            <div className="flex flex-wrap gap-2">
              {this.props.question.tags.map((tag) => (
                <span
                  key={tag}
                className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {this.props.question.link && (
                <button
                  className="rounded-full bg-sky-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-500/20 dark:bg-sky-500 dark:hover:bg-sky-400"
                  onClick={() => {
                    window.open(this.props.question.link, "_blank");
                  }}
                >
                  Solution
                </button>
              )}
              <button
                className="rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                onClick={() => {
                  this.props.changeQuestion();
                }}
              >
                Get Question
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
