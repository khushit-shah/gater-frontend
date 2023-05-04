import React, { Component } from "react";

export default class Header extends Component {
  render() {
    return (
      <header className="flex items-center justify-between py-4 px-6 bg-blue-400">
        <h1 className="text-3xl font-bold text-white font-sans">GateR</h1>
      </header>
    );
  }
}
