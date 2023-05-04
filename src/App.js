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
  useEffect(() => {
   QuestionService.init(() => {
    setQuestion(QuestionService.getRandomQuestion());
    setLoading(false);
  });
  }, []);
  return (
    <MathJaxContext>
      <div className="flex flex-col min-h-screen justify-between">
        <Header></Header>

        {loading ? (
          <div className="flex items-center justify-center h-screen grow">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
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
            <p className="text-gray-900">Loading...</p>
          </div>
        ) : (
          <div className="mb-auto grow ">
            <FilterTags tagsSelected={(tags) => {
              console.log("here==");
              setFilterTags(tags);
              setQuestion(QuestionService.getRandomQuestion(tags));
            }}></FilterTags>
            <Question question={question} changeQuestion={()=>{
              setQuestion(QuestionService.getRandomQuestion(filterTags));
            }}></Question>
          </div>
        )}

        <Footer></Footer>
      </div>
    </MathJaxContext>
  );
}

export default App;
