import { MathJaxContext } from "better-react-mathjax";
import Header from "./Header/Header";
import Question from "./Question/Question";
import { useEffect, useState } from "react";
import Footer from "./Footer/Footer";
import FilterTags from "./FilterTags/FilterTags";
import { QuestionService } from "./QuestionService";
import QuestionLists from "./QuestionLists/QuestionLists";
import ListEditorModal from "./QuestionLists/ListEditorModal";

function App() {
  const [loading, setLoading] = useState(true);
  const [filterTags, setFilterTags] = useState([]);
  const [savedLists, setSavedLists] = useState([]);
  const [activeListId, setActiveListId] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [themePreference, setThemePreference] = useState("system");
  const [systemTheme, setSystemTheme] = useState("light");
  const [listEditor, setListEditor] = useState(null);

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
      setSavedLists(QuestionService.getSavedLists());
      setActiveListId(QuestionService.getActiveListId());
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("theme-preference", themePreference);
  }, [themePreference]);

  useEffect(() => {
    if (!loading) {
      QuestionService.setActiveListId(activeListId);
    }
  }, [activeListId, loading]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeListId]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [filterTags]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (activeListId !== "all" && !savedLists.some((list) => list.id === activeListId)) {
      setActiveListId("all");
    }
  }, [activeListId, loading, savedLists]);

  useEffect(() => {
    const resolvedTheme = themePreference === "system" ? systemTheme : themePreference;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    document.body.classList.toggle("dark", resolvedTheme === "dark");
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [themePreference, systemTheme]);

  const activeListBase =
    activeListId === "all"
      ? {
          id: "all",
          name: "All questions",
          questionIds: QuestionService.getGlobalQuestionIds(),
        }
      : savedLists.find((list) => list.id === activeListId) || {
          id: "all",
          name: "All questions",
          questionIds: QuestionService.getGlobalQuestionIds(),
        };
  const activeQuestions = QuestionService.getQuestionsByIdsAndTags(
    activeListBase.questionIds || [],
    filterTags
  );
  const activeList = {
    ...activeListBase,
    questionCount: activeQuestions.length,
  };
  const currentQuestion =
    activeQuestions.length > 0
      ? activeQuestions[((currentIndex % activeQuestions.length) + activeQuestions.length) % activeQuestions.length]
      : {
          title: "No questions available",
          question: "",
          link: "",
          tags: [],
        };

  const selectList = (listId) => {
    setActiveListId(listId);
  };

  const openCreateListModal = () => {
    if (filterTags.length === 0 || activeQuestions.length === 0) {
      return;
    }

    setListEditor({
      mode: "create",
      listId: null,
      name: `Filtered list ${savedLists.length + 1}`,
      listName: "",
      currentFilterTags: [...filterTags],
      currentQuestionIds: activeQuestions.map((question) => question.id),
    });
  };

  const openEditListModal = (list) => {
    setListEditor({
      mode: "edit",
      listId: list.id,
      name: list.name,
      listName: list.name,
      currentFilterTags: [...filterTags],
      currentQuestionIds: activeQuestions.map((question) => question.id),
    });
  };

  const closeListEditor = () => {
    setListEditor(null);
  };

  const submitListEditor = ({ name, useCurrentFilters }) => {
    if (!listEditor || !name.trim()) {
      return;
    }

    if (listEditor.mode === "create") {
      const list = QuestionService.createList(
        name,
        listEditor.currentQuestionIds,
        listEditor.currentFilterTags
      );
      const nextLists = QuestionService.addList(list);
      setSavedLists(nextLists);
      setActiveListId(list.id);
      setListEditor(null);
      return;
    }

    const updates = { name };
    if (useCurrentFilters && listEditor.currentQuestionIds.length > 0) {
      updates.questionIds = listEditor.currentQuestionIds;
      updates.sourceTags = listEditor.currentFilterTags;
    }

    const nextLists = QuestionService.updateList(listEditor.listId, updates);
    setSavedLists(nextLists);
    setListEditor(null);
  };

  const deleteList = (listId) => {
    const list = savedLists.find((item) => item.id === listId);
    if (!list) {
      return;
    }

    const shouldDelete = window.confirm(`Delete "${list.name}"?`);
    if (!shouldDelete) {
      return;
    }

    const nextLists = QuestionService.deleteList(listId);
    setSavedLists(nextLists);
    if (activeListId === listId) {
      setActiveListId("all");
    }
  };

  const stepQuestion = (delta) => {
    if (activeQuestions.length === 0) {
      return;
    }
    setCurrentIndex((previousIndex) => previousIndex + delta);
  };

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
                  }}
                  onSaveFilteredList={openCreateListModal}
                  canSaveFilteredList={filterTags.length > 0 && activeQuestions.length > 0}
                ></FilterTags>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                  <div className="order-1 lg:order-1">
                    <Question
                      question={currentQuestion}
                      listName={activeList.name}
                      currentIndex={
                        activeQuestions.length === 0
                          ? 0
                          : ((currentIndex % activeQuestions.length) + activeQuestions.length) %
                            activeQuestions.length
                      }
                      totalQuestions={activeQuestions.length}
                      onPrevious={() => stepQuestion(-1)}
                      onNext={() => stepQuestion(1)}
                    ></Question>
                  </div>
                  <div className="order-2 lg:order-2">
                    <QuestionLists
                      activeList={activeList}
                      activeListId={activeListId}
                      filterTags={filterTags}
                      filteredCount={activeQuestions.length}
                      savedLists={savedLists}
                      onSelectList={selectList}
                      onEditList={openEditListModal}
                      onDeleteList={deleteList}
                    />
                  </div>
                </div>
              </div>
            )}
          </main>

          <Footer
            themePreference={themePreference}
            onThemeChange={setThemePreference}
          ></Footer>

          <ListEditorModal
            isOpen={Boolean(listEditor)}
            mode={listEditor?.mode || "create"}
            listName={listEditor?.listName || ""}
            defaultName={listEditor?.name || ""}
            currentFilterTags={listEditor?.currentFilterTags || []}
            currentQuestionIds={listEditor?.currentQuestionIds || []}
            onCancel={closeListEditor}
            onSubmit={submitListEditor}
          />
        </div>
      </div>
    </MathJaxContext>
  );
}

export default App;
