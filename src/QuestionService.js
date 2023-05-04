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
      fetch("questions-filtered.json")
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
    if(!tags || tags.length === 0) {
        console.log("aaa");
        return this.questions[Math.floor(Math.random() * this.questions.length)];
    }
    let mustHave = new Set();
    let ors = new Set();

    for(let tag of tags) {
        if(tag.startsWith("-")) {
            mustHave.add(tag.substr(1));
            ors.add(tag.substr(1));
        }
        else {
            ors.add(tag);
        }
    }
    console.log(mustHave);
    console.log(ors);
    let filtered = this.questions.filter(question => {
        for(let must of mustHave) {
            if(!question.tags.includes(must)) return false;
        }
        for(let tag of question.tags) {
            if(ors.has(tag)) return true;
        }
        return false;
    })

    console.log(filtered);
    if(filtered.length === 0) {
        return {title: "Error: no question with this filters.", question: "", link:"", tags:[]};
    }
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  static getTags() {
    let tags = new Set();
    for(let question of this.questions) {
        for(let tag of question.tags) {
            tags.add(tag);
        }
    }

    return Array.from(tags);
  }

  static getCount(tag) {
    if(this.count.has(tag)) return this.count.get(tag);
    else {
        let cnt = 0;
        for(let question of this.questions) {
            if(question.tags.includes(tag)) cnt ++;
        }

        this.count.set(tag, cnt);
        return cnt;
    }
  }
}
