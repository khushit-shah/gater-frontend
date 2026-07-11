export class QuestionService {
  static questions = [];
  static loaded = false;
  static count = new Map();
  static QUESTIONS_STORAGE_KEY = "questions";
  static GLOBAL_LIST_STORAGE_KEY = "global-question-list";
  static LISTS_STORAGE_KEY = "question-lists";
  static ACTIVE_LIST_STORAGE_KEY = "active-question-list";
  static MARK_TAGS = ["1-mark", "2-marks"];
  static QUESTION_TYPE_TAGS = [
    "normal",
    "multiple-selects",
    "numerical-answers",
    "fill-in-the-blanks",
    "output",
  ];

  static isYearTag(tag) {
    return tag.startsWith("gate");
  }

  static isMarkTag(tag) {
    return this.MARK_TAGS.includes(tag);
  }

  static isQuestionTypeTag(tag) {
    return this.QUESTION_TYPE_TAGS.includes(tag);
  }

  static shuffleArray(items) {
    const nextItems = [...items];
    for (let index = nextItems.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
    }
    return nextItems;
  }

  static init(cb) {
    if (this.loaded) {
      if (cb) cb();
      return;
    }

    const cachedQuestions = localStorage.getItem(this.QUESTIONS_STORAGE_KEY);
    if (cachedQuestions) {
      this.questions = JSON.parse(cachedQuestions).map((question, index) => ({
        ...question,
        id: question.id ?? index,
      }));
      this.ensureGlobalQuestionList();
      this.loaded = true;
      if (cb) cb();
    } else {
      fetch(`${process.env.PUBLIC_URL}/questions-filtered.json`)
        .then((data) => data.json())
        .then((data) => {
          this.questions = data.map((question, index) => ({
            ...question,
            id: index,
          }));
          localStorage.setItem(
            this.QUESTIONS_STORAGE_KEY,
            JSON.stringify(this.questions)
          );
          this.ensureGlobalQuestionList();
          this.loaded = true;
          if (cb) cb();
        });
    }
  }

  static getAllQuestions() {
    return this.questions;
  }

  static getQuestionById(id) {
    return this.questions.find((question) => question.id === id);
  }

  static getQuestionsByIds(ids) {
    const byId = new Map(this.questions.map((question) => [question.id, question]));
    return ids.map((id) => byId.get(id)).filter(Boolean);
  }

  static getFilteredQuestions(tags) {
    if (!tags || tags.length === 0) {
      return this.questions;
    }

    const year = new Set();
    const markTags = new Set();
    const questionTypeTags = new Set();
    const topicTags = new Set();

    for (const tag of tags) {
      if (this.isYearTag(tag)) {
        year.add(tag);
      } else if (this.isMarkTag(tag)) {
        markTags.add(tag);
      } else if (this.isQuestionTypeTag(tag)) {
        questionTypeTags.add(tag);
      } else {
        topicTags.add(tag);
      }
    }

    return this.questions.filter((question) => {
      const matchesYear = year.size === 0 || [...year].some((value) => question.tags.includes(value));
      const matchesMark =
        markTags.size === 0 || [...markTags].some((value) => question.tags.includes(value));
      const matchesQuestionType =
        questionTypeTags.size === 0 ||
        [...questionTypeTags].some((value) => question.tags.includes(value));
      const matchesTopic =
        topicTags.size === 0 || [...topicTags].some((value) => question.tags.includes(value));

      return matchesYear && matchesMark && matchesQuestionType && matchesTopic;
    });
  }

  static getQuestionIdsForTags(tags) {
    return this.getFilteredQuestions(tags).map((question) => question.id);
  }

  static getRandomQuestionFromQuestions(questions) {
    if (!questions || questions.length === 0) {
      return {
        title: "Error: no question with this filters.",
        question: "",
        link: "",
        tags: [],
      };
    }

    return questions[Math.floor(Math.random() * questions.length)];
  }

  static getQuestionAtIndex(questions, index) {
    if (!questions || questions.length === 0) {
      return {
        title: "Error: no question with this filters.",
        question: "",
        link: "",
        tags: [],
      };
    }

    const safeIndex = ((index % questions.length) + questions.length) % questions.length;
    return questions[safeIndex];
  }

  static getTags() {
    let tags = new Set();
    for (let question of this.questions) {
      for (let tag of question.tags) {
        tags.add(tag);
      }
    }

    return Array.from(tags);
  }

  static getCount(tag) {
    if (this.count.has(tag)) return this.count.get(tag);
    else {
      let cnt = 0;
      for (let question of this.questions) {
        if (question.tags.includes(tag)) cnt++;
      }

      this.count.set(tag, cnt);
      return cnt;
    }
  }

  static getSavedLists() {
    const rawLists = localStorage.getItem(this.LISTS_STORAGE_KEY);
    if (!rawLists) return [];

    try {
      const parsed = JSON.parse(rawLists);
      return parsed
        .filter((list) => list && list.id && list.name && Array.isArray(list.questionIds))
        .map((list) => ({
          ...list,
          questionIds: list.questionIds
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && this.getQuestionById(id)),
        }))
        .filter((list) => list.questionIds.length > 0);
    } catch (error) {
      return [];
    }
  }

  static saveLists(lists) {
    localStorage.setItem(this.LISTS_STORAGE_KEY, JSON.stringify(lists));
  }

  static createList(name, questionIds, sourceTags = []) {
    const trimmedName = name.trim();
    const listId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `list-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    return {
      id: listId,
      name: trimmedName,
      questionIds: this.shuffleArray([...new Set(questionIds)]),
      sourceTags: [...new Set(sourceTags)],
      createdAt: new Date().toISOString(),
    };
  }

  static addList(list) {
    const lists = this.getSavedLists();
    const nextLists = [...lists, list];
    this.saveLists(nextLists);
    return nextLists;
  }

  static updateList(listId, updates) {
    const nextLists = this.getSavedLists().map((list) => {
      if (list.id !== listId) {
        return list;
      }

      const nextList = { ...list };

      if (typeof updates.name === "string") {
        nextList.name = updates.name.trim();
      }

      if (Array.isArray(updates.questionIds)) {
        nextList.questionIds = this.shuffleArray([...new Set(updates.questionIds)]);
      }

      if (Array.isArray(updates.sourceTags)) {
        nextList.sourceTags = [...new Set(updates.sourceTags)];
      }

      nextList.updatedAt = new Date().toISOString();
      return nextList;
    });

    this.saveLists(nextLists);
    return nextLists;
  }

  static deleteList(listId) {
    const nextLists = this.getSavedLists().filter((list) => list.id !== listId);
    this.saveLists(nextLists);
    return nextLists;
  }

  static getActiveListId() {
    return localStorage.getItem(this.ACTIVE_LIST_STORAGE_KEY) || "all";
  }

  static setActiveListId(listId) {
    localStorage.setItem(this.ACTIVE_LIST_STORAGE_KEY, listId);
  }

  static ensureGlobalQuestionList() {
    const globalList = localStorage.getItem(this.GLOBAL_LIST_STORAGE_KEY);
    if (globalList) {
      try {
        const parsed = JSON.parse(globalList);
        const validIds = Array.isArray(parsed)
          ? parsed
              .map((id) => Number(id))
              .filter((id) => Number.isInteger(id) && this.getQuestionById(id))
          : [];

        if (validIds.length === this.questions.length) {
          return validIds;
        }
      } catch (error) {
        // fall through and rebuild
      }
    }

    const questionIds = this.shuffleArray(this.questions.map((question) => question.id));
    localStorage.setItem(this.GLOBAL_LIST_STORAGE_KEY, JSON.stringify(questionIds));
    return questionIds;
  }

  static getGlobalQuestionIds() {
    return this.ensureGlobalQuestionList();
  }
}
