export class QuestionService {
  static questions = [];
  static loaded = false;
  static count = new Map();

  static init(cb) {
    if (this.loaded) return;
    if (localStorage.getItem("questions")) {
      this.questions = JSON.parse(localStorage.getItem("questions"));
      this.loaded = true;
      cb();
    } else {
      fetch("/gater-frontend/questions-filtered.json")
        .then((data) => data.json())
        .then((data) => {
          this.questions = data;
          localStorage.setItem("questions", JSON.stringify(data));
          this.loaded = true;
          cb();
        });
    }
  }

  static getRandomQuestion(tags) {
    console.log(tags);
    if (!tags || tags.length === 0) {
      console.log("aaa");
      return this.questions[Math.floor(Math.random() * this.questions.length)];
    }
    let year = new Set();
    let tag = new Set();

    for (let t of tags) {
      if (t.startsWith("gate")) {
        year.add(t);
      } else {
        tag.add(t);
      }
    }
    console.log(year);
    console.log(tag);

    let filtered = this.questions.filter((question) => {
      let valid = false;
      for (let y of year) {
        if (question.tags.includes(y)) {
          valid = true;
          break;
        }
      }
      if (!valid && year.size !== 0) return false;

      for (let t of tag) {
        if (question.tags.includes(t)) return true;
      }

      if (tag.size === 0) return true;

      return false;
    });

    console.log(filtered);
    if (filtered.length === 0) {
      return {
        title: "Error: no question with this filters.",
        question: "",
        link: "",
        tags: [],
      };
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
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
}
