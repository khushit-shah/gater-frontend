import { QuestionService } from "./QuestionService";

beforeEach(() => {
  // Reset internal state
  QuestionService.questions = [
    // id 0: has 1-mark, normal, topic arrays, year gate-2020
    { id: 0, title: "q0", tags: ["1-mark", "normal", "arrays", "gate-2020"] },
    // id 1: has 2-marks, multiple-selects, topic sorting, year gate-2021
    { id: 1, title: "q1", tags: ["2-marks", "multiple-selects", "sorting", "gate-2021"] },
    // id 2: no mark, numerical-answers, topic graphs
    { id: 2, title: "q2", tags: ["numerical-answers", "graphs", "gate-2020"] },
    // id 3: has 1-mark, no question type, no topic
    { id: 3, title: "q3", tags: ["1-mark", "gate-2019"] },
    // id 4: has no mark, no question type, no topic, gate-2021
    { id: 4, title: "q4", tags: ["gate-2021"] },
    // id 5: has 2-marks, output type, topic arrays
    { id: 5, title: "q5", tags: ["2-marks", "output", "arrays", "gate-2020"] },
  ];

  // Clear caches
  QuestionService.count = new Map();
  // Clear localStorage used keys
  localStorage.removeItem(QuestionService.GLOBAL_LIST_STORAGE_KEY);
  localStorage.removeItem(QuestionService.LISTS_STORAGE_KEY);
  localStorage.removeItem(QuestionService.ACTIVE_LIST_STORAGE_KEY);
  QuestionService.loaded = true; // avoid async init
});

afterEach(() => {
  // Cleanup
  localStorage.clear();
});

test("filter: mark tags (1-mark)", () => {
  const results = QuestionService.getFilteredQuestions(["1-mark"]);
  expect(results.map((q) => q.id).sort()).toEqual([0, 3]);
});

test("filter: mark tags (2-marks)", () => {
  const results = QuestionService.getFilteredQuestions(["2-marks"]);
  expect(results.map((q) => q.id).sort()).toEqual([1, 5]);
});

test("filter: no-mark returns questions without mark tags", () => {
  const results = QuestionService.getFilteredQuestions([QuestionService.NO_MARK_TAG]);
  // ids 2 and 4 have no mark tags
  expect(results.map((q) => q.id).sort()).toEqual([2, 4]);
});

test("filter: question type normal", () => {
  const results = QuestionService.getFilteredQuestions(["normal"]);
  expect(results.map((q) => q.id)).toEqual([0]);
});

test("filter: no-question-type returns questions without any question type tag", () => {
  const results = QuestionService.getFilteredQuestions([QuestionService.NO_QUESTION_TYPE_TAG]);
  // ids 3 and 4 have no question type tags
  expect(results.map((q) => q.id).sort()).toEqual([3, 4]);
});

test("filter: topic arrays", () => {
  const results = QuestionService.getFilteredQuestions(["arrays"]);
  expect(results.map((q) => q.id).sort()).toEqual([0, 5]);
});

test("filter: no-topic returns questions without topic tags", () => {
  const results = QuestionService.getFilteredQuestions([QuestionService.NO_TOPIC_TAG]);
  // ids 3 and 4 have no topic tags
  expect(results.map((q) => q.id).sort()).toEqual([3, 4]);
});

test("filter: year tags (gate-2020)", () => {
  const results = QuestionService.getFilteredQuestions(["gate-2020"]);
  expect(results.map((q) => q.id).sort()).toEqual([0, 2, 5]);
});

test("filter: combined filters (1-mark + normal + arrays)", () => {
  const results = QuestionService.getFilteredQuestions(["1-mark", "normal", "arrays"]);
  // only id 0 matches all three
  expect(results.map((q) => q.id)).toEqual([0]);
});

test("getQuestionIdsForTags and getQuestionsByIdsAndTags interplay", () => {
  const ids = QuestionService.getQuestionIdsForTags(["arrays"]);
  // ids should be 0 and 5 (order may vary due to internal ordering)
  expect(new Set(ids)).toEqual(new Set([0, 5]));

  // Now request subset by ids with tags filter
  const subset = QuestionService.getQuestionsByIdsAndTags([0, 1, 5], ["arrays"]);
  expect(subset.map((q) => q.id).sort()).toEqual([0, 5]);
});

test("global list: ensureGlobalQuestionList creates and returns a global shuffled list of all ids", () => {
  const globalIds = QuestionService.ensureGlobalQuestionList();
  // Should contain all ids 0..5
  expect(new Set(globalIds)).toEqual(new Set([0, 1, 2, 3, 4, 5]));
  // Should be stored in localStorage
  const stored = JSON.parse(localStorage.getItem(QuestionService.GLOBAL_LIST_STORAGE_KEY));
  expect(Array.isArray(stored)).toBe(true);
  expect(new Set(stored)).toEqual(new Set([0, 1, 2, 3, 4, 5]));

  // If we call ensureGlobalQuestionList again and localStorage contains a full valid list, it should return that list
  const returned = QuestionService.ensureGlobalQuestionList();
  expect(returned).toEqual(stored);
});

test("saved lists: create, add, getSavedLists, update and delete", () => {
  const list = QuestionService.createList(" My List  ", [1, 2, 2, 3], ["1-mark", "1-mark"]);
  // name should be trimmed, questionIds and sourceTags deduplicated
  expect(list.name).toBe("My List");
  expect(new Set(list.questionIds)).toEqual(new Set([1, 2, 3]));
  expect(new Set(list.sourceTags)).toEqual(new Set(["1-mark"]));

  // add list
  const all = QuestionService.addList(list);
  expect(Array.isArray(all)).toBe(true);
  expect(all.length).toBe(1);

  const saved = QuestionService.getSavedLists();
  expect(saved.length).toBe(1);
  expect(saved[0].name).toBe("My List");

  // update list name and questionIds
  const updated = QuestionService.updateList(saved[0].id, {
    name: "  Updated Name",
    questionIds: [4, 4, 5],
    sourceTags: ["arrays"],
  });
  const fetched = QuestionService.getSavedLists().find((l) => l.id === saved[0].id);
  expect(fetched.name).toBe("Updated Name");
  expect(new Set(fetched.questionIds)).toEqual(new Set([4, 5]));
  expect(new Set(fetched.sourceTags)).toEqual(new Set(["arrays"]));

  // delete
  const afterDelete = QuestionService.deleteList(saved[0].id);
  expect(afterDelete.length).toBe(0);
  expect(QuestionService.getSavedLists().length).toBe(0);
});

test("getCount returns correct counts including special no- tags", () => {
  // Count for a normal topic
  expect(QuestionService.getCount("arrays")).toBe(2);
  // No-mark should be questions without any mark tags (ids 2 and 4)
  expect(QuestionService.getCount(QuestionService.NO_MARK_TAG)).toBe(2);
  // No-question-type should be ids 3 and 4
  expect(QuestionService.getCount(QuestionService.NO_QUESTION_TYPE_TAG)).toBe(2);
  // No-topic should be ids 3 and 4
  expect(QuestionService.getCount(QuestionService.NO_TOPIC_TAG)).toBe(2);
});

// Tests for OR within a section (marks) and AND between sections (marks + topic + year)

test("filter: marks OR (1-mark or 2-marks) returns union of both marks", () => {
  const results = QuestionService.getFilteredQuestions(["1-mark", "2-marks"]);
  // ids with 1-mark: 0,3; with 2-marks: 1,5 => union [0,1,3,5]
  expect(new Set(results.map((q) => q.id))).toEqual(new Set([0, 1, 3, 5]));
});

test("filter: (1-mark OR 2-marks) AND arrays AND gate-2020 (OR in section, AND between sections)", () => {
  const results = QuestionService.getFilteredQuestions(["1-mark", "2-marks", "arrays", "gate-2020"]);
  // Should match questions that have (1-mark OR 2-marks) AND arrays AND gate-2020 => ids 0 and 5
  expect(new Set(results.map((q) => q.id))).toEqual(new Set([0, 5]));
});

test("filter: (1-mark OR 2-marks) AND arrays (no year) returns same two array+mark questions", () => {
  const results = QuestionService.getFilteredQuestions(["1-mark", "2-marks", "arrays"]);
  expect(new Set(results.map((q) => q.id))).toEqual(new Set([0, 5]));
});
