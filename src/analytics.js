const GA_MEASUREMENT_ID = "G-V2VB8QYQLV";

const toQuestionContext = (question, currentIndex, totalQuestions, activeList, filterTags) => ({
  active_list_id: activeList?.id || "all",
  active_list_name: activeList?.name || "All questions",
  current_index: Number.isInteger(currentIndex) ? currentIndex : 0,
  total_questions: Number.isInteger(totalQuestions) ? totalQuestions : 0,
  question_id: question?.id ?? "",
  question_title: question?.title || "",
  filter_tags: (filterTags || []).join(","),
});

export const sendAnalyticsEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    ...params,
    send_to: GA_MEASUREMENT_ID,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(["event", eventName, payload]);
  }
};

export const buildAnalyticsContext = ({
  activeList,
  currentIndex,
  currentQuestion,
  filterTags,
  savedLists,
  totalQuestions,
}) => ({
  app_section: "gater-frontend",
  saved_lists_count: Array.isArray(savedLists) ? savedLists.length : 0,
  ...toQuestionContext(currentQuestion, currentIndex, totalQuestions, activeList, filterTags),
});

