import React from "react";
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";

const themeOptions = [
  {
    value: "light",
    icon: FiSun,
  },
  {
    value: "dark",
    icon: FiMoon,
  },
  {
    value: "system",
    icon: FiMonitor,
  },
];

export default function Footer({ themePreference, onThemeChange }) {
  return (
    <footer className="border-t border-slate-300 bg-white/90 px-4 py-4 text-slate-700 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-200 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1 text-sm leading-6">
          <p>© 2023 GateR.</p>
          <p>
            Special thanks to{" "}
            <a
              className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
              href="https://www.gateoverflow.in"
              target="_blank"
              rel="noreferrer"
            >
              GateOverflow
            </a>
            .
          </p>
          <p>
            <a
              className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
              href="https://www.goclasses.in?affCode=QL2QGI"
              target="_blank"
              rel="noreferrer"
            >
              Use code SHAH11 or QL2QGI
            </a>{" "}
            on the Go Classes website for the maximum discount on their courses.
          </p>
          <p>
            Developed with love by{" "}
            <a
              className="font-medium text-blue-700 underline underline-offset-4 dark:text-blue-300"
              href="https://khushitshah.com"
              target="_blank"
              rel="noreferrer"
            >
              khushitshah.com
            </a>
            .
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <div className="inline-flex rounded-full border border-slate-400 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            {themeOptions.map(({ value, icon: Icon }) => {
              const active = themePreference === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onThemeChange(value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                  aria-pressed={active}
                  aria-label={value}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
