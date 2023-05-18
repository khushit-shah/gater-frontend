import React, { Component } from "react";
import { MathJax } from "better-react-mathjax";
export default class Question extends Component {
  render() {
    return (
      <div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-medium pb-3">
              {this.props.question.title}
            </h2>
            <MathJax
              dynamic="true"
              className="text-gray-500 mt-1 leading-6 text-xl overflow-auto whitespace-normal"
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
          <div className="mb-4">
            {this.props.question.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
          {this.props.question.link && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                window.open(this.props.question.link, "_blank");
              }}
            >
              Solution
            </button>
          )}
          <button
            className="bg-green-500 hover:bg-green-700 ml-5 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              this.props.changeQuestion();
            }}
          >
            Get Question
          </button>
        </div>
      </div>
    );
  }
}
