import React, { Component } from "react";
import { AiFillGithub } from "react-icons/ai";

export default class Header extends Component {
  render() {
    return (
      <header className="border-b border-slate-300 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sans">
            GateR
          </h1>
          <p
            className="text-3xl text-slate-700 dark:text-slate-200"
            title="Report bug or request feature, or just star the repo :)"
          >
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/khushit-shah/gater-frontend"
            >
              <AiFillGithub />
            </a>
          </p>
        </div>
      </header>
    );
  }
}
