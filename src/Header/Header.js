import React, { Component } from "react";
import { AiFillGithub } from "react-icons/ai";

export default class Header extends Component {
  render() {
    return (
      <header className="flex items-center justify-between py-4 px-6 bg-blue-400">
        <h1 className="text-3xl font-bold text-white font-sans">GateR </h1>
        <p className="text-white text-3xl" title="Report bug or request feature, or just star the repo :)"><a rel="noreferrer" target="_blank" href="https://github.com/khushit-shah/gater-frontend"><AiFillGithub /></a></p>
      </header>
    );
  }
}
