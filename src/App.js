import { MathJaxContext } from "better-react-mathjax";
import Header from "./Header/Header";
import Question from "./Question/Question";
import { useEffect, useState } from "react";
import Footer from "./Footer/Footer";
import FilterTags from "./FilterTags/FilterTags";
import { QuestionService } from "./QuestionService";

function App() {
  const [loading, setLoading] = useState(true);
  const [filterTags, setFilterTags] = useState([]);
  const [question, setQuestion] = useState({});
  const [themePreference, setThemePreference] = useState("system");
  const [systemTheme, setSystemTheme] = useState("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme-preference");
    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      setThemePreference(storedTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light");
    };

    syncSystemTheme();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", syncSystemTheme);
    } else {
      mediaQuery.addListener(syncSystemTheme);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", syncSystemTheme);
      } else {
        mediaQuery.removeListener(syncSystemTheme);
      }
    };
  }, []);

  useEffect(() => {
    QuestionService.init(() => {
      setQuestion(QuestionService.getRandomQuestion());
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("theme-preference", themePreference);
  }, [themePreference]);

  useEffect(() => {
    const resolvedTheme = themePreference === "system" ? systemTheme : themePreference;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.body.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [themePreference, systemTheme]);

  return (
    <MathJaxContext>
      <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header></Header>

          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <svg
                  className="mr-3 h-5 w-5 animate-spin text-slate-900 dark:text-slate-100"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20a8 8 0 008-8h-4a4 4 0 01-4 4v4zm2-17.709A7.962 7.962 0 0120 12h-4a4 4 0 00-4-4V1l3 1.291z"
                  ></path>
                </svg>
                <p>Loading...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <FilterTags
                  tagsSelected={(tags) => {
                    setFilterTags(tags);
                    setQuestion(QuestionService.getRandomQuestion(tags));
                  }}
                ></FilterTags>
                <Question
                  question={question}
                  changeQuestion={() => {
                    setQuestion(QuestionService.getRandomQuestion(filterTags));
                  }}
                ></Question>
              </div>
            )}
          </main>

          <Footer
            themePreference={themePreference}
            onThemeChange={setThemePreference}
          ></Footer>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default App;
